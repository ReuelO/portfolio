// generateData.js
// Node.js script to auto-generate categories.json and projects.json with nested sub-categories

import fs from 'fs'
import path from 'path'

const ROOT_DIR = '.' // Root folder containing categories
const EXCLUDE_DIRS = new Set(['.git', 'node_modules', '.DS_Store'])

function generateCategories() {
  const categories = []

  if (!fs.existsSync(ROOT_DIR)) return categories

  const rootItems = fs.readdirSync(ROOT_DIR, { withFileTypes: true })

  for (const item of rootItems) {
    if (item.isDirectory() && !EXCLUDE_DIRS.has(item.name)) {
      const category = {
        key: item.name.replace(/\s+/g, '').toLowerCase(),
        label: item.name,
        path: path.join(ROOT_DIR, item.name).replace('./', '/') + '/',
        subCategories: [],
      }

      const categoryPath = path.join(ROOT_DIR, item.name)
      const subItems = fs.readdirSync(categoryPath, { withFileTypes: true })

      for (const subItem of subItems) {
        if (subItem.isDirectory() && !EXCLUDE_DIRS.has(subItem.name)) {
          category.subCategories.push({
            key: subItem.name.replace(/\s+/g, '').toLowerCase(),
            label: subItem.name,
            path:
              path.join(categoryPath, subItem.name).replace('./', '/') + '/',
          })
        }
      }

      categories.push(category)
    }
  }

  return categories
}

function generateProjects(categories) {
  const projects = []

  for (const cat of categories) {
    for (const sub of cat.subCategories) {
      const subDir = sub.path.replace(/\/$/, '')

      if (!fs.existsSync(subDir)) continue

      const items = fs.readdirSync(subDir, { withFileTypes: true })

      for (const item of items) {
        if (item.isDirectory() && !EXCLUDE_DIRS.has(item.name)) {
          projects.push({
            name: item.name,
            category: cat.key,
            subCategory: sub.key,
            description: `A sample project in ${cat.label} / ${sub.label}`,
            demoLink: `${sub.path}${item.name}/`, // GitHub Pages style link
            repoLink: `https://github.com/ReuelO/portfolio/${cat.key}/${sub.key}/${item.name}`,
          })
        }
      }
    }
  }

  return projects
}

// Write JSON files
const categories = generateCategories()
const projects = generateProjects(categories)

fs.writeFileSync('categories.json', JSON.stringify(categories, null, 2))
fs.writeFileSync('projects.json', JSON.stringify(projects, null, 2))

console.log('✅ categories.json and projects.json generated successfully.')
