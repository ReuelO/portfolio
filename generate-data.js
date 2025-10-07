// generateData.js
// Node.js script to robustly auto-generate categories.json and projects.json with nested sub-categories, including image links

import fs from 'fs'
import path from 'path'

const ROOT_DIR = '.' // Root folder containing categories
const EXCLUDE_DIRS = new Set([
  '.git',
  'node_modules',
  '.DS_Store',
  '.vscode',
  '.github',
])
const CATEGORY_FILE = 'categories.json'
const PROJECT_FILE = 'projects.json'

function safeReadDirSync(dirPath) {
  try {
    return fs.readdirSync(dirPath, { withFileTypes: true })
  } catch (err) {
    console.warn(`Warning: Could not read directory ${dirPath}: ${err.message}`)
    return []
  }
}

function normalizeKey(name) {
  return name
    .replace(/\s+/g, '')
    .replace(/[^\w-]/g, '')
    .toLowerCase()
}

function normalizeLabel(name) {
  return name
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function generateCategories() {
  const categories = []

  if (!fs.existsSync(ROOT_DIR)) return categories

  const rootItems = safeReadDirSync(ROOT_DIR)

  for (const item of rootItems) {
    if (
      item.isDirectory() &&
      !EXCLUDE_DIRS.has(item.name) &&
      !item.name.startsWith('.')
    ) {
      const categoryKey = normalizeKey(item.name)
      const categoryLabel = normalizeLabel(item.name)
      const categoryPath = path.join(ROOT_DIR, item.name)
      const category = {
        key: categoryKey,
        label: categoryLabel,
        path: path.relative('.', categoryPath).replace(/\\/g, '/') + '/',
        subCategories: [],
      }

      const subItems = safeReadDirSync(categoryPath)
      for (const subItem of subItems) {
        if (
          subItem.isDirectory() &&
          !EXCLUDE_DIRS.has(subItem.name) &&
          !subItem.name.startsWith('.')
        ) {
          const subKey = normalizeKey(subItem.name)
          const subLabel = normalizeLabel(subItem.name)
          const subPath = path.join(categoryPath, subItem.name)
          category.subCategories.push({
            key: subKey,
            label: subLabel,
            path: path.relative('.', subPath).replace(/\\/g, '/') + '/',
          })
        }
      }

      categories.push(category)
    }
  }

  return categories
}

function findImageLink(projectDir, projectName) {
  // Look for common image files
  const exts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg']
  for (const ext of exts) {
    const imgPath = path.join(projectDir, `cover.${ext}`)
    if (fs.existsSync(imgPath)) {
      return path.relative('.', imgPath).replace(/\\/g, '/')
    }
  }
  // Fallback: placeholder with project name
  return `https://via.placeholder.com/400x250?text=${encodeURIComponent(
    projectName
  )}`
}

function generateProjects(categories) {
  const projects = []

  for (const cat of categories) {
    for (const sub of cat.subCategories) {
      const subDir = sub.path.replace(/\/$/, '')
      if (!fs.existsSync(subDir)) continue

      const items = safeReadDirSync(subDir)
      for (const item of items) {
        if (
          item.isDirectory() &&
          !EXCLUDE_DIRS.has(item.name) &&
          !item.name.startsWith('.')
        ) {
          // Try to read project metadata if available
          let description = `A sample project in ${cat.label} / ${sub.label}`
          let tags = [cat.label, sub.label]
          let meta = {}
          const projectDir = path.join(subDir, item.name)
          const metaPath = path.join(projectDir, 'project.json')
          if (fs.existsSync(metaPath)) {
            try {
              meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
              if (meta.description) description = meta.description
              if (Array.isArray(meta.tags)) tags = meta.tags
            } catch (err) {
              console.warn(
                `Warning: Could not parse ${metaPath}: ${err.message}`
              )
            }
          }

          // Attempt to find a demo link (index.html or README.md)
          let demoLink = `${sub.path}${item.name}/`
          const demoHtml = path.join(projectDir, 'index.html')
          const demoMd = path.join(projectDir, 'README.md')
          if (!fs.existsSync(demoHtml) && !fs.existsSync(demoMd)) {
            demoLink = ''
          }

          // Attempt to find a repo link (assume GitHub structure)
          let repoLink = `https://github.com/ReuelO/portfolio/tree/main/${cat.key}/${sub.key}/${item.name}`
          if (meta.repoLink) repoLink = meta.repoLink

          // Attempt to find an image link
          let imageLink = findImageLink(projectDir, item.name)
          if (meta.imageLink) imageLink = meta.imageLink

          projects.push({
            name: item.name,
            category: cat.key,
            subCategory: sub.key,
            description,
            demoLink,
            repoLink,
            imageLink,
            tags,
          })
        }
      }
    }
  }

  return projects
}

// Write JSON files safely
function writeJsonFile(filename, data) {
  try {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2))
    console.log(`${filename} generated successfully.`)
  } catch (err) {
    console.error(`Failed to write ${filename}: ${err.message}`)
  }
}

// Main
try {
  const categories = generateCategories()
  writeJsonFile(CATEGORY_FILE, categories)
  const projects = generateProjects(categories)
  writeJsonFile(PROJECT_FILE, projects)
} catch (err) {
  console.error('Error generating data:', err)
}
