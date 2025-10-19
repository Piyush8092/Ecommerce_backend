let Carsole = require('../../models/CarsoleModel');

const getSpecificCarsole = async (req, res) => {
    try {
        let id = req.params.id;
        const carsole = await Carsole.findById(id);
        res.json({ message: 'Carsole fetched successfully', status: 200, data: carsole, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { getSpecificCarsole };



