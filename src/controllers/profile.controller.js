const User = require('./../models/user.model')


exports.fetchProfile = async (req, res) => {
  const profileName = req.params.profileName
  try {
    const user = await User.findOne({ profileName })
    res.status(200).send({ user })
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: 'Unable to fetch profile details' })
  }
}

exports.saveProfile = async (req, res) => {
  const cred = req.body
  console.log('cred');
  const profileName = req.params.profileName
  console.log(req.user.profileName, profileName);
  if (req.user.profileName !== profileName) {
    res.status(401).send({ message: 'Unable to edit others details' })
  }
  try {
    const user = await User.findById(req.user._id)
    user.completion = checkDetailsCompletion(user)
    user[cred[0]] = cred[1]
    const result = await user.save()
    res.status(200).send({ cred, user })
  } catch (error) {
    res.status(400).send({ message: 'Unable to save profile details' })
  }
}

exports.saveResume = async (req, res) => {
  console.log('resumee');
  const cred = req.body
  const profileName = req.params.profileName
  console.log(cred);
  if (req.user.profileName !== profileName) {
    res.status(400).send({ message: 'Unable to edit others details' })
  }
  try {
    if (!cred.absPath) { throw new Error() }
    const user = await User.findById(req.user._id)
    user.resume = cred.absPath
    await user.save()
    res.status(200).send({ cred: ['resume', cred.absPath], user })
  } catch (error) {
    res.status(400).send({ message: 'Unable to save profile details' })
  }
}

exports.saveImage = async (req, res) => {
  const cred = req.body
  const profileName = req.params.profileName
  console.log(cred);
  if (req.user.profileName !== profileName) {
    res.status(400).send({ message: 'Unable to edit others details' })
  }
  try {
    if (!cred.absPath) { throw new Error() }
    const user = await User.findById(req.user._id)
    user.imageURL = cred.absPath
    await user.save()
    res.status(200).send({ cred: ['profile picture', cred.absPath], user })
  } catch (error) {
    res.status(400).send({ message: 'Unable to save profile details' })
  }
}

exports.saveCertifications = async (req, res) => {
  const cred = req.body
  const profileName = req.params.profileName
  console.log(cred.absPath);
  console.log(cred.title);
  if (req.user.profileName !== profileName) {
    res.status(400).send({ message: 'Unable to edit others details' })
  }
  try {
    const user = await User.findById(req.user._id)
    user.certifications.push({ title: cred.title, certificate: cred.absPath })
    await user.save()
    console.log(cred);
    res.status(200).send({ cred: ['certificate', cred], user })
  } catch (error) {
    res.status(400).send({ message: 'Unable to save profile details' })
  }
}
checkDetailsCompletion = (user) => {
  let completion = 0
  if (user.description) {
    completion += 10
  }
  if (user.emailVerified) {
    completion += 10
  }
  if (user.username) {
    completion += 10
  }
  if (user.canJoin) {
    completion += 10
  }
  if (user.experience) {
    completion += 10
  }
  if (user.work) {
    completion += 10
  }
  if (user.skills.length) {
    completion += 10
  }
  return completion
}