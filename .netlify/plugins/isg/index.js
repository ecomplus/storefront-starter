module.exports = {
  async onPostBuild ({ utils, constants }) {
    const { PUBLISH_DIR } = constants
    let isIsg

    try {
      const { createdFiles, modifiedFiles } = utils.git
      isIsg = createdFiles.includes('.isg') || modifiedFiles.includes('.isg')
    } catch (err) {
      console.error(err)
      isIsg = false
    }

    if (isIsg) {
      console.log('>> Restoring ISG cache')
      await utils.cache.restore(PUBLISH_DIR)
    } else {
      console.log('>> Saving ISG cache')
      await utils.cache.save(PUBLISH_DIR)
    }
  }
}
