const mongoose= require('mongoose');
const DileverySchedualSchema=new mongoose.Schema({
    delivery_id: { type: String, required: true, unique: true },
    rider_id: { type: String, required: true },
    delivery_time: { type: Date, required: true },
    box_location: { type: String, required: true },
    status: { type: String, enum: ['Scheduled', 'Completed'], default: 'Scheduled' },
});
module.exports = mongoose.model('Dilevery', DileverySchedualSchema);