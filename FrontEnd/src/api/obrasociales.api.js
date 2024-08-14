import axios from 'axios';
export const getObraSociales = async () => {
    return await axios.get('http://localhost:3000/api/medicalinsurance');
}
