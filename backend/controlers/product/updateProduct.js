let Carsole = require('../../models/CarsoleModel');

const updateProduct = async (req, res) => {
    try {
        const payload = req.body;
        let id = req.params.id;
        if(req.user.role !== 'ADMIN' ) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        const updatedProduct = await Carsole.findByIdAndUpdate({_id:id}, {
           payload
        }, { new: true });
        res.json({ message: 'Carsole updated successfully', status: 200, data: updatedProduct, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { updateProduct };

