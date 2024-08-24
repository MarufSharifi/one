import ansis from 'ansis'
import { detect } from 'detect-package-manager'
import FSExtra from 'fs-extra'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { cloneStarter } from './helpers/cloneStarter'
import { getProjectName } from './helpers/getProjectName'
import { getTemplateInfo } from './helpers/getTemplateInfo'
import { installDependencies } from './helpers/installDependencies'
import { validateNpmName } from './helpers/validateNpmPackage'

const { existsSync, readFileSync, writeFileSync } = FSExtra

let projectPath = ''

export async function create(args: { template?: string }) {
  const gitVersionString = Number.parseFloat(
    execSync(`git --version`).toString().replace(`git version `, '').trim()
  )
  if (gitVersionString < 2.27) {
    console.error(`\n\n ⚠️ vxrn can't install: Git version must be >= 2.27\n\n`)
    process.exit(1)
  }

  projectPath ||= await getProjectName(projectPath)

  let template = await getTemplateInfo(args.template)

  // space
  console.info()

  const resolvedProjectPath = path.resolve(process.cwd(), projectPath)
  const projectName = path.basename(resolvedProjectPath)

  const { valid, problems } = validateNpmName(projectName)
  if (!valid) {
    console.error(
      `Could not create a project called ${ansis.red(
        `"${projectName}"`
      )} because of npm naming restrictions:`
    )

    problems!.forEach((p) => console.error(`    ${ansis.red.bold('*')} ${p}`))
    process.exit(1)
  }

  if (fs.existsSync(resolvedProjectPath)) {
    console.info()
    console.info(
      ansis.red('🚨 [vxrn] error'),
      `You tried to make a project called ${ansis.underline(
        ansis.blueBright(projectName)
      )}, but a folder with that name already exists: ${ansis.blueBright(resolvedProjectPath)}

${ansis.bold(ansis.red(`Please pick a different project name 🥸`))}`
    )
    console.info()
    console.info()
    process.exit(1)
  }
  console.info()
  console.info(`Creating a new vxrn app ${ansis.blueBright(resolvedProjectPath)}...`)
  fs.mkdirSync(resolvedProjectPath)
  console.info(ansis.green(`${projectName} folder created.`))

  try {
    await cloneStarter(template, resolvedProjectPath, projectName)
    process.chdir(resolvedProjectPath)
    // space
    console.info()
  } catch (e) {
    console.error(`[vxrn] Failed to copy example into ${resolvedProjectPath}\n\n`, e)
    process.exit(1)
  }

  // change root package.json's name to project name
  updatePackageJsonName(projectName, resolvedProjectPath)

  // TODO allow choice
  execSync(`touch yarn.lock`)

  console.info('Installing packages. This might take a couple of minutes.')
  console.info()

  const packageManager =
    ('packageManager' in template ? template.packageManager : undefined) || (await detect())

  try {
    console.info('installing with ' + packageManager)
    await installDependencies(resolvedProjectPath, packageManager as any)
  } catch (e: any) {
    console.error('[vxrn] error installing with ' + packageManager + '\n' + `${e}`)
    process.exit(1)
  }

  await template.extraSteps({
    isFullClone: true,
    projectName,
    projectPath: resolvedProjectPath,
  })

  console.info()
}

function updatePackageJsonName(projectName: string, dir: string) {
  const packageJsonPath = path.join(dir, 'package.json')
  if (existsSync(packageJsonPath)) {
    const content = readFileSync(packageJsonPath).toString()
    const contentWithUpdatedName = content.replace(/("name": ")(.*)(",)/, `$1${projectName}$3`)
    writeFileSync(packageJsonPath, contentWithUpdatedName)
  }
}
