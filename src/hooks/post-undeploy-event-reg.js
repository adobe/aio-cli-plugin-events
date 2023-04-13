
module.exports = async function ({ appConfig }) {
  console.log('post-undeploy-event-reg ', appConfig.events)
}
