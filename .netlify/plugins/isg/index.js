const getCompiledFiles = ({ utils }) => {
  return utils.git.createdFiles.concat(utils.git.modifiedFiles)
}

const handleCacheList = async ({ utils, constants }, filepaths, method) => {
  for (let i = 0; i < filepaths.length; i++) {
    if (filepaths[i].startsWith(`${constants.PUBLISH_DIR}/`)) {
      await utils.cache[method](filepaths[i])
    }
  }
}

module.exports = {
  async onPreBuild (context) {
    if (getCompiledFiles(context).includes('.isg')) {
      const cachedFiles = await context.utils.cache.list()
      await handleCacheList(context, cachedFiles, 'restore')
    }
  },

  async onPostBuild (context) {
    const compiledFiles = getCompiledFiles(context)
    await handleCacheList(context, compiledFiles, 'save')
    if (!compiledFiles.includes('.isg')) {
      const cachedFiles = await context.utils.cache.list()
      const oldCachedFiles = cachedFiles.filter(filepath => !compiledFiles.includes(filepath))
      await handleCacheList(context, oldCachedFiles, 'remove')
    }
  }
}
