const addWithRef = async (uuid, body, ParentModel, parentRef, ChildModule, childRef) => {
  let dataResponse = {}
  try {
    const { _id } = await ParentModel.findOne({ uuid })
    body[parentRef] = _id

    const _child = new ChildModule(body)
    const doc = await _child.save()

    await ParentModel.findOneAndUpdate(
      { uuid: uuid },
      { $push: { [childRef]: doc._id } }
    )

    dataResponse = {
      data: doc.toPublic(),
      status: 200
    }
  } catch (e) {
    dataResponse = {
      data: e.message,
      status: 400
    }
  }

  return dataResponse
}

module.exports = addWithRef
