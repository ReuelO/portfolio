// generate-projects-json.js
// Run: node generate-projects-json.js
// Fully dynamic: Scans BASE_PATH for ALL top-level directories (no hardcoded TOP_LEVEL_DIRS),
// treats each top-level dir's immediate subdirs as categories (e.g., websites/css → category "css"),
// then scans category subdirs for projects (folders with index.html or README.md).
// Ignores common hidden/system dirs like .git, node_modules, .DS_Store, etc.
// No hardcoded dir/project names—everything discovered from filesystem.
// Outputs projects.json with inferred categories and projects.

const fs = require('fs')
const path = require('path')

// Base portfolio directory (update as needed)
const BASE_PATH = 'C:\\Users\\Admin\\Documents\\Reuel\\Code\\portfolio\\'

// Ignored directories (common hidden/system files/folders)
const IGNORED_DIRS = [
  '.git',
  'node_modules',
  '.DS_Store',
  'Thumbs.db',
  '__pycache__',
  '.vscode',
  '.idea',
  'dist',
  'build',
  '.next',
  'out',
  '.cache',
  'coverage',
  'logs',
  'temp',
  'tmp',
]

function isIgnored(dirName) {
  return IGNORED_DIRS.some(
    (ignored) => dirName === ignored || dirName.startsWith('.')
  )
}

function discoverTopLevelDirs(basePath) {
  if (!fs.existsSync(basePath)) {
    console.warn(`Base path does not exist: ${basePath}`)
    return []
  }

  const items = fs.readdirSync(basePath, { withFileTypes: true })
  const topLevelDirs = []

  items.forEach((item) => {
    if (item.isDirectory() && !isIgnored(item.name)) {
      const fullPath = path.join(basePath, item.name)
      // Only consider dirs that have subdirs (potential groups like 'websites')
      const subItems = fs.readdirSync(fullPath, { withFileTypes: true })
      const hasSubDirs = subItems.some(
        (subItem) => subItem.isDirectory() && !isIgnored(subItem.name)
      )
      if (hasSubDirs) {
        topLevelDirs.push({ name: item.name, path: fullPath })
        console.log(`Discovered top-level group: ${item.name}`)
      }
    }
  })

  return topLevelDirs
}

function scanCategoriesAndProjects(topLevelPath, topLevelName) {
  const categoryData = {} // Local for this top-level group

  const items = fs.readdirSync(topLevelPath, { withFileTypes: true })
  items.forEach((item) => {
    if (item.isDirectory() && !isIgnored(item.name)) {
      const categoryPath = path.join(topLevelPath, item.name)
      const categoryKey = item.name // e.g., 'css', 'react' (no hardcoding)

      const projects = scanProjects(categoryPath, categoryKey)
      if (projects.length > 0) {
        categoryData[categoryKey] = { projects }
        console.log(
          `  → Category "${categoryKey}": Found ${projects.length} projects`
        )
      } else {
        console.log(`  → Category "${categoryKey}": No projects found`)
        categoryData[categoryKey] = { projects: [] }
      }
    }
  })

  return categoryData
}

function scanProjects(categoryPath, categoryKey) {
  const projects = []
  const items = fs.readdirSync(categoryPath, { withFileTypes: true })

  items.forEach((item) => {
    if (item.isDirectory() && !isIgnored(item.name)) {
      const projectPath = path.join(categoryPath, item.name)
      const indexPath = path.join(projectPath, 'index.html')
      const readmePath = path.join(projectPath, 'README.md')

      if (fs.existsSync(indexPath) || fs.existsSync(readmePath)) {
        let description = 'Project description here.'
        if (fs.existsSync(readmePath)) {
          const readmeContent = fs.readFileSync(readmePath, 'utf8')
          const match = readmeContent.match(/^# .*\n\n(.*)/m)
          if (match) description = match[1].trim().substring(0, 100) + '...'
        }

        projects.push({
          name: item.name.replace(/-website$|-app$|-project$/i, ''),
          folder: item.name,
          description,
        })
      }
    }
  })

  return projects.sort((a, b) => a.name.localeCompare(b.name))
}

// Main execution: Fully dynamic discovery
console.log('Dynamically scanning BASE_PATH for top-level directories...\n')
const topLevelDirs = discoverTopLevelDirs(BASE_PATH)

// Merge all categories/projects across discovered top-level groups
const allProjectsData = {}
topLevelDirs.forEach(({ name: topLevelName, path: topLevelPath }) => {
  console.log(`\nScanning group "${topLevelName}":`)
  const groupCategories = scanCategoriesAndProjects(topLevelPath, topLevelName)
  Object.assign(allProjectsData, groupCategories) // Flatten: all categories in root JSON
})

const outputPath = path.join(__dirname, 'projects.json')
fs.writeFileSync(outputPath, JSON.stringify(allProjectsData, null, 2), 'utf8')

const totalProjects = Object.values(allProjectsData).reduce(
  (acc, cat) => acc + cat.projects.length,
  0
)
const numCategories = Object.keys(allProjectsData).length
console.log(
  `\nGenerated ${outputPath} with ${numCategories} discovered categories and ${totalProjects} total projects.`
)

// Example output (fully dynamic):
// {
//   "css": { "projects": [{ "name": "adventure trails", "folder": "adventure-trails-website", "description": "..." }] },
//   "tailwind": { "projects": [...] },
//   "react": { "projects": [...] },
//   ...
// }
