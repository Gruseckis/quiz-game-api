const index = async (req, res) => {
  res.status(200).send({ payload: { message: 'Quiz-game API' } });
};

export default index;
