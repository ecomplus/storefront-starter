const handleCacheList = async ({ utils, constants }, filepaths, method) => {
  for (let i = 0; i < filepaths.length; i++) {
    const filepath = filepaths[i]
    if (filepath.startsWith(`${constants.PUBLISH_DIR}/`)) {
      console.log(`ISG ${method} ${filepath}`)
      await utils.cache[method](filepath)
    } else {
      console.log(`ISG ignore ${filepath}`)
    }
  }
}

module.exports = {
  async onPostBuild (context) {
    const { utils, constants } = context
    const compiledFiles = utils.git.createdFiles.concat(utils.git.modifiedFiles)
    const isIsg = compiledFiles.includes('.isg')

    const absoluteCachedFiles = await context.utils.cache.list()
    const testFile = `/${constants.PUBLISH_DIR}/index.html`
    const absolutePath = absoluteCachedFiles
      .find(filepath => filepath.endsWith(testFile))
    let cachedFiles
    if (absolutePath) {
      const basePath = absolutePath.replace(testFile, '/')
      cachedFiles = absoluteCachedFiles.map(filepath => filepath.replace(basePath, ''))
    } else {
      cachedFiles = absoluteCachedFiles
    }

    if (isIsg) {
      console.log('>> Restoring cache')
      await handleCacheList(context, cachedFiles, 'restore')
    }

    console.log('>> Saving cache')
    await handleCacheList(context, compiledFiles, 'save')

    if (!isIsg) {
      console.log('>> Removing old cache')
      const oldCachedFiles = cachedFiles
        .filter(filepath => utils.git.deletedFiles.includes(filepath))
      await handleCacheList(context, oldCachedFiles, 'remove')
    }
  }
}
