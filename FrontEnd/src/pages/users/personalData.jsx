/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '../../context/patients/PatientsProvider';
import { useAuth } from '../../context/global/AuthProvider';
import Select from 'react-select';
import { notifyError } from '../../components/ToastConfig';
import { confirmDialog } from '../../components/SwalConfig';
import AddressAutocomplete from '../../components/AddressAutocomplete';
import { Spinner } from '../../components/Spinner';

export function PersonalData() {
  const { healthInsurances, getHealthInsurances, createUserFunction, getUserByDniFunction, userByDni } = usePatients();
  const { login, dni } = useAuth();
  const [selectedObraSociales, setSelectedObraSociales] = useState(null);
  const [countryCode, setCountryCode] = useState('+54');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dni: '',
    birthDate: '',
    password: '',
    name: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    healthInsuranceId: '',
  });

  const getInsuranceId = (insurance) =>
    insurance?.id ?? insurance?.healthInsuranceId ?? insurance?.idInsuranceCompany;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);    // Client-side validation to mirror backend validators
    const nationalIdDigits = String(formData.dni).replace(/\D/g, '');
    if (nationalIdDigits.length < 7) {
      notifyError('El DNI debe tener al menos 7 dígitos.');
      return;
    }
    const birthDatePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthDatePattern.test(formData.birthDate)) {
      notifyError('La fecha de nacimiento debe tener formato YYYY-MM-DD.');
      return;
    }
    const today = new Date();
    const birthDateStr = new Date(formData.birthDate + 'T00:00:00');
    if (birthDateStr > today) {
      notifyError('La fecha de nacimiento no puede ser posterior a hoy.');
      return;
    }
    if (!formData.name.trim() || !formData.lastName.trim()) {
      notifyError('Nombre y apellido son obligatorios.');
      return;
    }
    if (!formData.address?.trim()) {
      notifyError('La dirección es obligatoria.');
      return;
    }
    if (!formData.healthInsuranceId) {
      notifyError('La Obra Social es obligatoria.');
      return;
    }
      if (!formData.password.trim()) {
        notifyError('Contraseña es obligatoria.');
        return;
      }

      try {
        const submitData = {
          ...formData,
          phone: `${countryCode} ${formData.phone.trim()}`,
        };
        await createUserFunction(submitData); // Asegura que la creación del user sea asíncrona

        login({
          identifier: formData.dni,
          credential: formData.password,
          userType: 'Patient',
        });

      if (window.notifySuccess) window.notifySuccess('Usuario registrado correctamente');
      navigate('/patient');
    } catch (error) {
      console.error('❌ FRONTEND - Error al registrar usuario:', error);
      setLoading(false);
      
      // Manejar error de DNI duplicado
      if (error?.code === 'DNI_ALREADY_EXISTS' || error?.message?.includes('ya está registrado')) {
        notifyError(`El DNI ${formData.dni} ya está registrado. Por favor, usa otro DNI o intenta iniciar sesión.`);
        return;
      }
      
      // If validation details are available from backend, show them
      const backendErrors = error?.response?.data?.errors || error?.errors || error?.data?.errors;
      if (backendErrors && backendErrors.length > 0) {
        const messages = backendErrors.map((e) => `${e.field || e.param || e.path || 'field'}: ${e.message || e.msg || e}`).join('; ');
        notifyError(messages);
      } else if (error?.message) {
        notifyError(error.message);
      } else {
        notifyError('Hubo un error al registrar el usuario. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      setPageLoading(true);
      await getHealthInsurances();
      setTimeout(() => setPageLoading(false), 400);
    })();
  }, []);

  useEffect(() => {
    if (dni) {
      getUserByDniFunction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dni]);

  useEffect(() => {
    // When user data is fetched from backend, prefill the form
    if (userByDni && Object.keys(userByDni).length > 0) {
      let fetchedPhone = userByDni.phone || '';
      const codes = ['+54', '+1', '+34', '+55', '+56', '+598', '+52', '+57', '+51'];
      for (const code of codes) {
        if (fetchedPhone.startsWith(`${code} `)) {
          setCountryCode(code);
          fetchedPhone = fetchedPhone.slice(code.length + 1).trim();
          break;
        } else if (fetchedPhone.startsWith(code)) {
          setCountryCode(code);
          fetchedPhone = fetchedPhone.slice(code.length).trim();
          break;
        }
      }

      setFormData((prev) => ({
        ...prev,
        dni: userByDni.nationalId || prev.dni,
        birthDate: userByDni.birthDate || prev.birthDate,
        name: userByDni.firstName || prev.name,
        lastName: userByDni.lastName || prev.lastName,
        phone: fetchedPhone || prev.phone,
        email: userByDni.email || prev.email,
        address: userByDni.address || prev.address,
        healthInsuranceId:
          userByDni.healthInsuranceId ||
          userByDni.insuranceCompanyId ||
          prev.healthInsuranceId,
      }));

      // set selected option for obra social if available
      const selectedInsuranceId =
        userByDni.healthInsuranceId || userByDni.insuranceCompanyId;
      if (selectedInsuranceId) {
        const option = (healthInsurances || []).find(
          (h) => String(getInsuranceId(h)) === String(selectedInsuranceId)
        );
        if (option) {
          setSelectedObraSociales({
            value: getInsuranceId(option),
            label: option.name,
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userByDni, healthInsurances]);

  const handleObraSocialChange = (selectedOption) => {
    setSelectedObraSociales(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      healthInsuranceId: selectedOption.value,
    }));
  };

  if (pageLoading) return <Spinner text="Cargando..." />;

  return (
    <div className="page-bg p-6 lg:p-10 flex items-center justify-center min-h-[80vh]">
      <div className="glass-solid p-8 lg:p-10 rounded-3xl shadow-glass animate-slide-up w-full max-w-lg">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">Registro de paciente</h1>
        <p className="text-gray-500 text-sm mb-6">Completá tus datos para crear tu cuenta</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">DNI</label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              required
              className="input"
            />
          </div>
          <div>
            <label className="label">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              required
              className="input"
            />
          </div>
          <div>
            <label className="label">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="input"
            />
          </div>
          <div>
            <label className="label">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="input"
            />
          </div>
          <div>
            <label className="label">Apellido</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="input"
            />
          </div>
          <div>
            <label className="label">Dirección</label>
            <AddressAutocomplete
              initialValue={formData.address}
              required={true}
              className="input"
              onSelect={(place) =>
                setFormData((prev) => ({
                  ...prev,
                  address: place.address,
                  addressLat: place.lat,
                  addressLon: place.lon,
                }))
              }
            />
          </div>
          <div>
            <label className="label">Teléfono</label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="input w-[140px] truncate"
              >
                <option value="+54">🇦🇷 +54</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+34">🇪🇸 +34</option>
                <option value="+55">🇧🇷 +55</option>
                <option value="+56">🇨🇱 +56</option>
                <option value="+598">🇺🇾 +598</option>
                <option value="+52">🇲🇽 +52</option>
                <option value="+57">🇨🇴 +57</option>
                <option value="+51">🇵🇪 +51</option>
              </select>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="input flex-1"
                placeholder="Ej. 11 1234-5678"
              />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="input"
            />
          </div>
          <div>
            <label className="label">Obra Social</label>
            <Select
              options={(healthInsurances || []).map((obrasocial) => ({
                value: getInsuranceId(obrasocial),
                label: obrasocial.name,
              }))}
              onChange={handleObraSocialChange}
              value={selectedObraSociales}
              className="react-select"
              placeholder="Seleccione obra social..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Registrando...
              </span>
            ) : (
              'Enviar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}



