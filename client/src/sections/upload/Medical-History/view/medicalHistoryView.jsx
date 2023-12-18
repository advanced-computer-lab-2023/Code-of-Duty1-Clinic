import { RecordsList, MedicalHistoryUpload } from '../..';
import AddTextHealthRecord from '../components/addTextHealthRecord';

export default function MedicalHistoryView({ patientID }) {
    return (
        <div style={{ width: '100%', maxWidth: '900px', margin: 'auto', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', color: '#333' }}>
                Medical History/Record
            </h1>

            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>
                        Add Text Medical Record/History
                    </h2>
                    <AddTextHealthRecord patientID={patientID} />
                </div>
                <div>
                    <h2 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>
                        Upload Medical Record/History File
                    </h2>
                    <MedicalHistoryUpload patientID={patientID} />
                </div>
            </div>

            <div>
                <RecordsList patientID={patientID} />
            </div>
        </div>
    );
}
