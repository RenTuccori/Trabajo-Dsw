import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/global/AuthProvider';
import {
  getStudiesByPatient,
  downloadStudy as downloadStudyAPI,
} from '../../api/studies.api';
import { getPatientbyNationalId } from '../../api/patients.api';
import { notifyError } from '../../components/ToastConfig';

function ViewStudies() {
  const { nationalId } = useAuth();
  const [studies, setStudies] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load patient by national ID
  const loadPatient = useCallback(async () => {
    try {
      const response = await getPatientbyNationalId({ nationalId: nationalId });
      if (!response || !response.data) {
        console.error('FRONTEND - loadPatient: Invalid response from backend:', response);
        return null;
      }
      const patientInfo = response?.data || {};
      const userData = patientInfo.user || {};

      setPatientData({
        ...patientInfo,
        firstName: patientInfo.firstName || userData.firstName || '',
        lastName: patientInfo.lastName || userData.lastName || '',
      });
      
      const patientId = patientInfo.id || patientInfo.idPatient || patientInfo.patientId;
      return patientId;
    } catch (error) {
      console.error('FRONTEND - Error loading patient data:', error);
      notifyError('Error loading patient data');
      return null;
    }
  }, [nationalId]);

  // Load patient studies
  const loadStudies = useCallback(async (patientId) => {
    try {
      const response = await getStudiesByPatient(patientId);
      setStudies(response.data || []);
    } catch (error) {
      console.error('FRONTEND - Error loading studies:', error);
      if (error.response?.status !== 404) {
        notifyError('Error loading studies');
      }
      setStudies([]);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const patientId = await loadPatient();
      if (patientId) {
        await loadStudies(patientId);
      }
      setLoading(false);
    };

    if (nationalId) {
      fetchData();
    }
  }, [nationalId, loadPatient, loadStudies]);

  const downloadStudy = async (studyId, fileName) => {
    try {
      const response = await downloadStudyAPI(studyId);

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading study:', error);
      notifyError('Error downloading file');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US');
  };

  if (!nationalId) {
    return (
      <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">
            You must log in as a patient
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading studies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          My Medical Studies
        </h1>

        {patientData && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Patient Information
            </h2>
            <p className="text-gray-600">National ID: {nationalId}</p>
            <p className="text-gray-600">First Name: {patientData.firstName}</p>
            <p className="text-gray-600">Last Name: {patientData.lastName}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Studies History ({studies.length})
          </h2>

          {studies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                No medical studies registered
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Studies performed by doctors will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Doctor
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Performance Date
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      File
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Description
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Upload Date
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(studies || []).map((study) => {
                    const studyId = study.id;
                    const performanceDate = study.performanceDate;
                    const uploadDate = study.uploadDate;
                    const fileName = study.fileName;
                    const description = study.description;

                    return (
                    <tr
                      key={studyId}
                      className="border-t border-gray-200"
                    >
                      <td className="px-4 py-2 text-sm">
                        Dr. {study.doctorName || '-'}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {formatDate(performanceDate)}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span className="text-blue-600 font-medium">
                          {fileName || 'Unnamed file'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {description || 'No description'}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {formatDate(uploadDate)}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <button
                          onClick={() =>
                            downloadStudy(
                              studyId,
                              fileName || 'study'
                            )
                          }
                          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewStudies;



