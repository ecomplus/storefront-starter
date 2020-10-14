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
    const { utils } = context
    const compiledFiles = utils.git.createdFiles.concat(utils.git.modifiedFiles)
    const cachedFiles = await context.utils.cache.list()
    const isIsg = compiledFiles.includes('.isg')
    if (isIsg) {
      console.log('>> Restoring cache')
      await handleCacheList(context, cachedFiles, 'restore')
    }
    console.log('>> Saving cache')
    await handleCacheList(context, compiledFiles, 'save')
    if (!isIsg) {
      const oldCachedFiles = cachedFiles.filter(filepath => !compiledFiles.includes(filepath))
      await handleCacheList(context, oldCachedFiles, 'remove')
    }
  }
}
