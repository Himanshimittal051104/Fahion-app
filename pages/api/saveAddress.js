import Deliverylocation from "@/models/Deliverylocation";
import connectDb from "@/db/connectDb";

export default async function handler(req, res) {
    await connectDb();
    res.setHeader('Cache-Control', 'no-store');
    if (req.method === 'POST') {
        const {
            fullName, mobileNumber, flatNo, area, city, country, state, pincode, landmark } = req.body;
        try {
            const newAddress = new Deliverylocation(req.body);
            await newAddress.save();
            res.status(201).json({ success: true, message: 'Address saved successfully!' });
        } catch (error) {
            console.error('Error saving address:', error);
            res.status(400).json({ success: false, message: "Mobile number must be exactly 10 digits" });
        }
    }else if (req.method === 'GET') {
        try {
            const addresses = await Deliverylocation.find(); 
            res.status(200).json(addresses);
        } catch (error) {
            res.status(500).json({ message: "Error fetching addresses", error: error.message });
        }
    }else {
        res.setHeader('Allow', ['POST','GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
