const getRecords = async (req, res) => {
  res.status(200).send({ message: "get request to /records" });
};
const postRecords = async (req, res) => {
  res.status(200).send({ message: "post request to /records" });
};
const patchRecords = async (req, res) => {
  res.status(200).send({ message: "patch request to /records" });
};
const deleteRecords = async (req, res) => {
  res.status(200).send({ message: "delete request to /records" });
};

export { getRecords, postRecords, deleteRecords, patchRecords };
