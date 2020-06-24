const errors = require('../config/errors');
const NumberPlate = require('../models/number-plate.modal');
const { HTTP_INTERNAL_SERVER, HTTP_BAD_REQUEST } = require('../config/errors');
const router = require('express').Router();

router.get('/count', async (req, res, next) => {
    try {
        const query = NumberPlate.find({
            status: true
        }).count();
        const result = await query.exec();
        res.status(200).json(result);
    } catch (err) {
        res.status(err.code || HTTP_INTERNAL_SERVER.code)
            .end(err.message || HTTP_INTERNAL_SERVER.message);
    }
});


router.get('/', async (req, res, next) => {
    try {
        let skip = 0, limit = 10;
        const queries = req.query;

        if (queries) {
            if (queries.start) {
                skip = queries.start - 1;
            }
        }

        const query = NumberPlate.find({
            status: true
        }, 'owner plateNumber', {
            skip,
            limit,
        }).sort('owner');

        const promise = query.exec();
        const plates = await promise;
        res.status(200).json(plates);
    } catch (err) {
        res.status(err.code || HTTP_INTERNAL_SERVER.code)
            .end(err.message || HTTP_INTERNAL_SERVER.message);
    }
});

router.get('/search', async (req, res, next) => {
    try {
        const queries = req.query || {};

        const query = NumberPlate.find({
            status: true,
            $text: {
                $search: queries.search
            }
        }, 'owner plateNumber').sort('owner');

        const promise = query.exec();
        const plates = await promise;
        res.status(200).json(plates);
    } catch (err) {
        res.status(err.code || HTTP_INTERNAL_SERVER.code)
            .end(err.message || HTTP_INTERNAL_SERVER.message);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const body = req.body;
        if (!body || !body.owner || !body.plateNumber) {
            throw errors.HTTP_BAD_REQUEST;
        }

        const existing = await (NumberPlate.findOne({
            plateNumber: body.plateNumber
        }).exec());
        if (existing && existing.plateNumber == body.plateNumber) {
            res.status(200).json(errors.PLATE_EXISTS);
            return;
        }

        const plate = new NumberPlate({
            owner: body.owner,
            plateNumber: body.plateNumber,
            status: true
        });

        if (!plate) {
            throw {}; // in fact internal server error
        }

        await plate.save();
        res.status(200).json({
            id: plate._id,
            owner: plate.owner,
            plateNumber: plate.plateNumber
        });
    } catch (err) {
        res.status(err.code || HTTP_INTERNAL_SERVER.code)
            .end(err.message || HTTP_INTERNAL_SERVER.message);
    }
});

router.put('/', async (req, res, next) => {
    try {
        const body = req.body;

        if (!body || !body.id) {
            throw HTTP_BAD_REQUEST;
        }

        let query = NumberPlate.findById(body.id);
        let result = await query.exec();
        if (!result) {
            throw errors.HTTP_NOT_FOUND;
        }

        const existing = await (NumberPlate.findOne({
            plateNumber: body.plateNumber
        }).exec());
        if (existing && existing.plateNumber == body.plateNumber
            && !(existing._id.equals(result._id))) {
            res.status(200).json(errors.PLATE_EXISTS);
            return;
        }

        query = NumberPlate.updateOne({
            _id: body.id,
            status: true
        }, {
            owner: body.owner || result.owner,
            plateNumber: body.plateNumber || result.plateNumber
        });

        result = await query.exec();
        if (!result) {
            throw errors.HTTP_INTERNAL_SERVER;
        }

        res.status(200).json(body);
    } catch (err) {
        res.status(err.code || HTTP_INTERNAL_SERVER.code)
            .end(err.message || HTTP_INTERNAL_SERVER.message);
    }
});

router.delete('/', async (req, res, next) => {
    try {
        const queries = req.query;

        if (!queries || !queries.id) {
            throw HTTP_BAD_REQUEST;
        }

        let query = NumberPlate.findOne({
            _id: queries.id,
            status: true
        });
        let result = await query.exec();
        if (!result) {
            throw errors.HTTP_NOT_FOUND;
        }

        query = NumberPlate.updateOne({
            _id: queries.id,
        }, {
            status: false
        });

        result = await query.exec();
        if (!result) {
            throw errors.HTTP_INTERNAL_SERVER;
        }

        res.status(200).json(queries);
    } catch (err) {
        res.status(err.code || HTTP_INTERNAL_SERVER.code)
            .end(err.message || HTTP_INTERNAL_SERVER.message);
    }
});

module.exports = router;
