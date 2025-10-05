// inject-projects-data.js
// Run: node inject-projects-data.js
// Scans absolute paths and injects into index.html (updates descriptions from README.md if available)

const fs = require('fs')
const path = require('path')

const baseUrl = 'C:/Users/Admin/Documents/Reuel/Code/portfolio' // Adjust as needed
const PATHS = {
  css: baseUrl + '/websites/css',
  tailwind: baseUrl + '/websites/tailwind',
  react: baseUrl + '/react',
  nextjs: baseUrl + '/nextjs',
  vitejs: baseUrl + '/vitejs',
  'react-native': baseUrl + '/react-native',
  node: baseUrl + '/node',
}

const PLACEHOLDER =
  '// Populated PROJECTS_DATA based on your initial project list'

function scanProjects(basePath, category) {
  if (!fs.existsSync(basePath)) return []
  const projects = []
  const items = fs.readdirSync(basePath, { withFileTypes: true })
  items.forEach((item) => {
    if (item.isDirectory()) {
      const projectPath = path.join(basePath, item.name)
      const indexPath = path.join(projectPath, 'index.html')
      const readmePath = path.join(projectPath, 'README.md')
      if (fs.existsSync(indexPath) || fs.existsSync(readmePath)) {
        let description = 'Project description here.' // Default
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

// Generate string
let projectsDataStr = 'const PROJECTS_DATA = {\n'
Object.entries(PATHS).forEach(([category, basePath]) => {
  const projects = scanProjects(basePath, category)
  projectsDataStr += `    '${category}': {\n        projects: [\n`
  projects.forEach((project) => {
    projectsDataStr += `            { name: '${project.name}', folder: '${
      project.folder
    }', description: '${project.description.replace(/'/g, "\\'")}' },\n`
  })
  projectsDataStr += `        ]\n    },\n`
})
projectsDataStr += '};\n'

const indexPath = path.join(__dirname, 'index.html')
let content = fs.readFileSync(indexPath, 'utf8')
content = content.replace(PLACEHOLDER, projectsDataStr)
fs.writeFileSync(indexPath, content, 'utf8')
console.log(
  `Injected data for ${Object.values(PATHS).reduce(
    (acc, base) => acc + scanProjects(base, '').length,
    0
  )} projects.`
)
