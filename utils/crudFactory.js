const checkInput = function (req, res, next) {
    const userDetails = req.body;
    const isEmpty = Object.keys(userDetails).length === 0;
    if (isEmpty) {
        res.status(400).json({
            status: 400,
            message: "Body can not be empty"
        })
    }
    else {
        next();
    }
}

const getAllFactory = (elementModel) => async (req, res) => {
    try {
        const data = await elementModel.find();
        if (data.length === 0)
            throw new Error("No Product found");
        else {
            msg = 'Data Found'
            res.json({
                status: 'success',
                statusCode: 200,
                message: msg,
                data: data

            })
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

const getElementByIdFactory = (elementModel) => async (req, res, next) => {
    try {
        const { id } = req.params;
        // const Product = ProductData.find((Product) => Product.id === id);
        const data = await elementModel.findById(id);
        if (!data) {
            throw new Error("Data not found");
        }
        res.json({
            status: 200,
            message: "Data Found",
            data: data
        });
    } catch (err) {
        // res.status(500).json({
        //     status: 500,
        //     message: err.message
        // })
        next(err)
    }
}

const createElementFactory = (elementModel) => async (req, res) => {
    try {
        console.log('creating product');
        const elementDetails = req.body;
        const data = await elementModel.create(elementDetails);
        console.log('post creation');
        res.status(200).json({
            message: "Data created successfully",
            data: data
        })

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })
    }
}

const updateElementByIdFactory = (elementModel) => async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProductData = req.body
        const updatedElement = await elementModel.findByIdAndUpdate(id, updatedProductData, { new: true })
        if (!updatedElement) {
            throw new Error("Data not found");
        }
        else {
            res.status(200).json({
                status: 200,
                message: "Data updated successfully",
                data: updatedElement
            })
        }

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })

    }
}

const deleteElementByIdFactory = (elementModel) => async (req, res) => {
    try {
        const { id } = req.params;
        const deletedElement = await elementModel.findByIdAndDelete(id)
        if (!deletedElement) {
            throw new Error("Data not found");
        }
        else {
            res.status(200).json({
                status: 200,
                message: "Data deleted successfully",
                data: deletedElement
            })
        }

    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        })

    }
}

module.exports = { checkInput, getAllFactory, getElementByIdFactory, createElementFactory, updateElementByIdFactory, deleteElementByIdFactory }