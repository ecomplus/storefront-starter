const getCompiledFiles = ({ utils }) => {
  return utils.git.createdFiles.concat(utils.git.modifiedFiles)
}

const handleCacheList = async ({ utils, constants }, filepaths, method) => {
  for (let i = 0; i < filepaths.length; i++) {
    const filepath = filepaths[i]
    if (filepath.startsWith(`${constants.PUBLISH_DIR}/`)) {
      console.log(`Cache ${method} ${filepath}`)
      await utils.cache[method](filepath)
    }
  }
}

module.exports = {
  async onPreBuild (context) {
    if (getCompiledFiles(context).includes('.isg')) {
      console.log('>> Restoring cache')
      const cachedFiles = await context.utils.cache.list()
      await handleCacheList(context, cachedFiles, 'restore')
    }
  },

  async onPostBuild (context) {
    console.log('>> Saving cache')
    const compiledFiles = getCompiledFiles(context)
    await handleCacheList(context, compiledFiles, 'save')
    if (!compiledFiles.includes('.isg')) {
      const cachedFiles = await context.utils.cache.list()
      const oldCachedFiles = cachedFiles.filter(filepath => !compiledFiles.includes(filepath))
      await handleCacheList(context, oldCachedFiles, 'remove')
    }
  }
}
