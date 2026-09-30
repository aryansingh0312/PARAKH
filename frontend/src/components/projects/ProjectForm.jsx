import { useState } from 'react';
import { ArrowLeft, LocateFixed, Save } from 'lucide-react';

const projectTypes = ['Skill Development', 'Education', 'Healthcare', 'Social Welfare', 'Rehabilitation', 'Other'];
const projectStatuses = ['active', 'inactive', 'suspended'];

const textFields = {
  projectName: 'Project name',
  projectCode: 'Project code',
  ngoName: 'NGO name',
  contactPerson: 'Contact person',
  contactPhone: 'Contact phone',
  address: 'Address',
  city: 'City',
  state: 'State',
  pincode: 'Pincode',
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function Field({ label, name, value, onChange, error, required = false, type = 'text', placeholder = '', min, max, step, autoComplete, inputMode }) {
  return (
    <div className="min-w-0">
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}{required && <span className="ml-1 text-rose-600" aria-hidden="true">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${error ? 'border-rose-300' : 'border-slate-200'}`}
      />
      {error && <p id={`${name}-error`} className="mt-1 text-xs text-rose-700">{error}</p>}
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, error, required = false }) {
  return (
    <div className="min-w-0">
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">{label}{required && <span className="ml-1 text-rose-600" aria-hidden="true">*</span>}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${error ? 'border-rose-300' : 'border-slate-200'}`}
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      {error && <p className="mt-1 text-xs text-rose-700">{error}</p>}
    </div>
  );
}

function ProjectForm({ initialProject, onSubmit, onCancel, submitLabel, submitting = false }) {
  const [form, setForm] = useState(() => {
    const values = {
      projectName: '',
      projectCode: '',
      ngoName: '',
      ngoRegistrationNumber: '',
      projectType: 'Skill Development',
      description: '',
      contactPerson: '',
      contactPhone: '',
      contactEmail: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      latitude: '',
      longitude: '',
      beneficiaryCount: '',
      startDate: today(),
      status: 'active',
      ...(initialProject || {}),
    };
    return {
      ...values,
      startDate: initialProject?.startDate ? new Date(initialProject.startDate).toISOString().slice(0, 10) : values.startDate,
      latitude: initialProject?.latitude ?? '',
      longitude: initialProject?.longitude ?? '',
      beneficiaryCount: initialProject?.beneficiaryCount ?? '',
    };
  });
  const [errors, setErrors] = useState({});
  const [locationMessage, setLocationMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};
    for (const [field, label] of Object.entries(textFields)) {
      if (!String(form[field] || '').trim()) nextErrors[field] = `${label} is required.`;
    }
    if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      nextErrors.contactEmail = 'Enter a valid email address.';
    }
    if (!/^\+?[0-9][0-9\s()-]{7,19}$/.test(form.contactPhone.trim())) {
      nextErrors.contactPhone = 'Enter a valid phone number.';
    }
    if (!/^\d{6}$/.test(form.pincode.trim())) nextErrors.pincode = 'Pincode must contain 6 digits.';
    if (!Number.isInteger(Number(form.beneficiaryCount)) || Number(form.beneficiaryCount) < 1) {
      nextErrors.beneficiaryCount = 'Enter a positive whole number.';
    }
    if (form.latitude === '' || !Number.isFinite(Number(form.latitude)) || Number(form.latitude) < -90 || Number(form.latitude) > 90) {
      nextErrors.latitude = 'Latitude must be between -90 and 90.';
    }
    if (form.longitude === '' || !Number.isFinite(Number(form.longitude)) || Number(form.longitude) < -180 || Number(form.longitude) > 180) {
      nextErrors.longitude = 'Longitude must be between -180 and 180.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    const payload = {
      ...form,
      projectCode: form.projectCode.trim().toUpperCase(),
      beneficiaryCount: Number(form.beneficiaryCount),
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
    };
    try {
      await onSubmit(payload);
    } catch (error) {
      setErrors((current) => ({ ...current, ...(error.errors || {}), ...(error.field ? { [error.field]: error.message } : {}) }));
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Location access is not available in this browser.');
      return;
    }
    setLocationMessage('Finding your location…');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setForm((current) => ({ ...current, latitude: coords.latitude.toFixed(6), longitude: coords.longitude.toFixed(6) }));
        setErrors((current) => ({ ...current, latitude: undefined, longitude: undefined }));
        setLocationMessage('Coordinates added from your current location.');
      },
      () => setLocationMessage('Location could not be accessed. Enter coordinates manually.'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const errorFor = (name) => errors[name] || (name === 'contactEmail' && form.contactEmail && errors.contactEmail ? errors.contactEmail : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 border-b border-slate-100 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-blue-800">Section 1</p>
          <h2 className="mt-1 font-heading text-lg font-semibold text-slate-900">Project Information</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Project Name" name="projectName" required value={form.projectName} onChange={handleChange} error={errorFor('projectName')} />
          <Field label="Project Code" name="projectCode" required value={form.projectCode} onChange={handleChange} error={errorFor('projectCode')} placeholder="e.g. ABC-SDC-001" />
          <SelectField label="Project Type" name="projectType" value={form.projectType} onChange={handleChange} options={projectTypes.map((type) => ({ value: type, label: type }))} />
          <div className="sm:col-span-2">
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={3} maxLength={2000} className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 border-b border-slate-100 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-blue-800">Section 2</p>
          <h2 className="mt-1 font-heading text-lg font-semibold text-slate-900">NGO / Organization</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="NGO Name" name="ngoName" required value={form.ngoName} onChange={handleChange} error={errorFor('ngoName')} />
          <Field label="Registration Number" name="ngoRegistrationNumber" value={form.ngoRegistrationNumber} onChange={handleChange} />
          <Field label="Contact Person" name="contactPerson" required value={form.contactPerson} onChange={handleChange} error={errorFor('contactPerson')} />
          <Field label="Contact Phone" name="contactPhone" required value={form.contactPhone} onChange={handleChange} error={errorFor('contactPhone')} type="tel" autoComplete="tel" />
          <Field label="Contact Email" name="contactEmail" value={form.contactEmail} onChange={handleChange} error={errorFor('contactEmail')} type="email" autoComplete="email" />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 border-b border-slate-100 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-blue-800">Section 3</p>
          <h2 className="mt-1 font-heading text-lg font-semibold text-slate-900">Location</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Field label="Address" name="address" required value={form.address} onChange={handleChange} error={errorFor('address')} /></div>
          <Field label="City" name="city" required value={form.city} onChange={handleChange} error={errorFor('city')} />
          <Field label="State" name="state" required value={form.state} onChange={handleChange} error={errorFor('state')} />
          <Field label="Pincode" name="pincode" required value={form.pincode} onChange={handleChange} error={errorFor('pincode')} inputMode="numeric" />
          <div className="flex items-end sm:col-span-2 sm:justify-end">
            {navigator.geolocation && <button type="button" onClick={useCurrentLocation} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"><LocateFixed className="h-4 w-4" />Use Current Location</button>}
          </div>
          <Field label="Latitude" name="latitude" required value={form.latitude} onChange={handleChange} error={errorFor('latitude')} type="number" min="-90" max="90" step="any" />
          <Field label="Longitude" name="longitude" required value={form.longitude} onChange={handleChange} error={errorFor('longitude')} type="number" min="-180" max="180" step="any" />
          <p className="text-xs text-slate-500 sm:col-span-2">Enter decimal coordinates, for example 28.6280, 77.3649. Map integration is not configured.</p>
          {locationMessage && <p role="status" className="text-xs text-slate-600 sm:col-span-2">{locationMessage}</p>}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 border-b border-slate-100 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-blue-800">Section 4</p>
          <h2 className="mt-1 font-heading text-lg font-semibold text-slate-900">Project Details</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Beneficiary Count" name="beneficiaryCount" required value={form.beneficiaryCount} onChange={handleChange} error={errorFor('beneficiaryCount')} type="number" min="1" step="1" />
          <Field label="Start Date" name="startDate" value={form.startDate} onChange={handleChange} error={errorFor('startDate')} type="date" />
          <SelectField label="Status" name="status" value={form.status} onChange={handleChange} options={projectStatuses.map((status) => ({ value: status, label: status[0].toUpperCase() + status.slice(1) }))} error={errorFor('status')} />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" onClick={onCancel} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"><ArrowLeft className="h-4 w-4" />Cancel</button>
        <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-wait disabled:opacity-60"><Save className="h-4 w-4" />{submitting ? 'Saving…' : submitLabel}</button>
      </div>
    </form>
  );
}

export default ProjectForm;