'use client'

import React, { useRef, useState } from 'react';
import {
    User,
    Mail,
    Phone,
    PenLine,
    Film,
    Clock,
    Hash,
    FileText,
    BadgeCheck,
    Quote,
    Tag,
    ChevronDown,
    X,
    CheckCircle2,
} from 'lucide-react';
import { upload } from '@vercel/blob/client';
import Button from '@/components/common/Button';
import useEntrance from '@/hooks/useEntrance';
import useScrollReveal from '@/hooks/useScrollReveal';
import { smoothScrollTo } from '@/lib/smoothScroll';
import {
    SUBMISSION_FOLDER,
    MAX_FILE_MB,
    PITCH_DECK_TYPES,
    CERTIFICATE_TYPES,
    FORMATS,
    GENRES,
    LOGLINE_MAX,
    SYNOPSIS_MAX,
    validateSubmission,
    safeFileName,
} from '@/lib/scriptSubmission';

/* -------------------------------------------------------------------------- */
/*  CONFIG – edit these as needed                                             */
/* -------------------------------------------------------------------------- */

// TODO(client): the legal disclaimer text is still pending from the client; don't write one.
// Paste the legal disclaimer here once you have it (one string per paragraph).
// While this array is empty, the "Legal Disclaimer" section is hidden and the
// Declaration section is automatically numbered 04 instead of 05.
const LEGAL_DISCLAIMER = [
    // "Paragraph 1 ...",
    // "Paragraph 2 ...",
];

const PITCH_DECK_RULES = {
    mimes: PITCH_DECK_TYPES,
    label: 'PDF',
};

const CERTIFICATE_RULES = {
    mimes: CERTIFICATE_TYPES,
    label: 'JPG, PNG, PDF',
};

const DECLARATIONS = [
    {
        key: 'swa',
        text: 'I confirm that my screenplay is registered with SWA and that the registration details provided are accurate.',
    },
    {
        key: 'author',
        text: 'I confirm that I am the original author of the submitted material or am duly authorised to submit it, and that I have the necessary rights to do so.',
    },
    {
        key: 'accurate',
        text: 'I have checked that all project details are accurate and that the required submission format has been followed.',
    },
];

const INITIAL_VALUES = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    format: '',
    genre: '',
    genreOther: '',
    runtime: '',
    episodes: '',
    episodeDuration: '',
    logline: '',
    synopsis: '',
    swaNumber: '',
};

const INITIAL_DECLARATIONS = { swa: false, author: false, accurate: false };

/* -------------------------------------------------------------------------- */
/*  SMALL UI PIECES (kept outside the page component so inputs keep focus)    */
/* -------------------------------------------------------------------------- */

const inputBase =
    'w-full pr-4 py-3.5 bg-transparent text-[15px] text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors border';

const borderFor = (error) => (error ? 'border-red-600' : 'border-[#202020]');

// Two-column section row: sticky number/title/note on the left, fields on the right.
const FormSection = ({ number, title, note, children }) => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 pt-8 sm:pt-10 border-t border-[#202020]">
        <div className="lg:col-span-4">
            <div data-reveal="rise" className="form-element lg:sticky lg:top-28 flex flex-col gap-3">
                <h2 className="text-[#black] text-sm sm:text-base tabular-nums">{number}</h2>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-black leading-tight">{title}</h3>
                {note && <p className="text-[#555] text-sm sm:text-[15px] leading-relaxed max-w-sm">{note}</p>}
            </div>
        </div>
        <div className="lg:col-span-8 flex flex-col gap-5 sm:gap-6">{children}</div>
    </div>
);

const Field = ({ label, required, hint, error, children, className = '' }) => (
    <div className={`form-element flex flex-col gap-2.5 ${className}`}>
        <label className="text-[15px] text-[#555]">
            {label}
            {required && <span className="text-red-600 ml-0.5">*</span>}
        </label>
        {children}
        {hint && !error && <p className="text-[12px] sm:text-[13px] text-gray-500 leading-relaxed">{hint}</p>}
        {error && <p className="text-[13px] text-red-600">{error}</p>}
    </div>
);

const IconInput = ({ icon: Icon, error, ...props }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-[18px] w-[18px] text-gray-400" strokeWidth={1.5} />
        </div>
        <input
            {...props}
            aria-invalid={error ? 'true' : undefined}
            className={`${inputBase} pl-12 ${borderFor(error)}`}
        />
    </div>
);

const IconTextarea = ({ icon: Icon, error, ...props }) => (
    <div className="relative">
        <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
            <Icon className="h-[18px] w-[18px] text-gray-400" strokeWidth={1.5} />
        </div>
        <textarea
            {...props}
            aria-invalid={error ? 'true' : undefined}
            className={`${inputBase} pl-12 resize-none ${borderFor(error)}`}
        />
    </div>
);

const IconSelect = ({ icon: Icon, error, children, ...props }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-[18px] w-[18px] text-gray-400" strokeWidth={1.5} />
        </div>
        <select
            {...props}
            aria-invalid={error ? 'true' : undefined}
            className={`${inputBase} pl-12 pr-11 appearance-none cursor-pointer ${borderFor(error)} ${props.value ? 'text-black' : 'text-gray-400'
                }`}
        >
            {children}
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <ChevronDown className="h-[18px] w-[18px] text-gray-400" strokeWidth={1.5} />
        </div>
    </div>
);

const FileDropzone = ({ file, onSelect, onRemove, accept, formatLabel, error, disabled }) => {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const openPicker = () => {
        if (!disabled) inputRef.current?.click();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        if (disabled) return;
        const dropped = e.dataTransfer.files?.[0];
        if (dropped) onSelect(dropped);
    };

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => {
                    const picked = e.target.files?.[0];
                    if (picked) onSelect(picked);
                    e.target.value = '';
                }}
            />

            {file ? (
                <div className="border border-[#202020] bg-white py-4 px-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-[20px] w-[20px] text-gray-500 shrink-0" strokeWidth={1.5} />
                        <div className="min-w-0">
                            <p className="text-[14px] font-semibold text-black truncate">{file.name}</p>
                            <p className="text-[12px] text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onRemove}
                        aria-label={`Remove ${file.name}`}
                        className="p-2 text-gray-500 hover:text-black transition-colors shrink-0"
                    >
                        <X className="h-[18px] w-[18px]" strokeWidth={1.5} />
                    </button>
                </div>
            ) : (
                <div
                    role="button"
                    tabIndex={0}
                    aria-invalid={error ? 'true' : undefined}
                    onClick={openPicker}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openPicker();
                        }
                    }}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className={`border bg-white py-8 sm:py-10 px-4 flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer text-center focus:outline-none focus:border-black ${error ? 'border-red-600' : dragging ? 'border-black' : 'border-[#202020] hover:border-gray-400'
                        }`}
                >
                    <p className="text-[13px] sm:text-[14px] font-semibold text-black">Choose file or drag here</p>
                    <p className="text-[11px] sm:text-[12px] text-gray-400 mb-2">
                        Supported format: {formatLabel} (max {MAX_FILE_MB} MB)
                    </p>
                    <Button as="span">
                        Browse File
                    </Button>
                </div>
            )}
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*  PAGE                                                                      */
/* -------------------------------------------------------------------------- */

const SubmitScriptPage = ({ blobUploads = false }) => {
    const containerRef = useRef(null);
    const formRef = useRef(null);

    const [values, setValues] = useState(INITIAL_VALUES);
    const [declarations, setDeclarations] = useState(INITIAL_DECLARATIONS);
    const [pitchDeck, setPitchDeck] = useState(null);
    const [certificate, setCertificate] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitStage, setSubmitStage] = useState('');

    const hasLegal = LEGAL_DISCLAIMER.length > 0;
    const declarationNumber = hasLegal ? '05' : '04';

    // The shared page entrance (headline word by word, intro line by line, then the banner),
    // and each form section's heading rising in as it enters
    useEntrance(containerRef);
    useScrollReveal(formRef);

    /* ---------------------------- handlers ---------------------------- */

    const setField = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleChange = (e) => setField(e.target.name, e.target.value);

    const handleFormat = (format) => {
        setValues((prev) => ({
            ...prev,
            format,
            // clear duration fields that no longer apply
            runtime: format === 'Feature Film' ? prev.runtime : '',
            episodes: format === 'Web Series' ? prev.episodes : '',
            episodeDuration: format === 'Web Series' ? prev.episodeDuration : '',
        }));
        setErrors((prev) => ({
            ...prev,
            format: undefined,
            runtime: undefined,
            episodes: undefined,
            episodeDuration: undefined,
        }));
    };

    const handleDeclaration = (key) => {
        setDeclarations((prev) => ({ ...prev, [key]: !prev[key] }));
        if (errors.declarations) setErrors((prev) => ({ ...prev, declarations: undefined }));
    };

    const handleFile = (key, file, rules) => {
        const setFile = key === 'pitchDeck' ? setPitchDeck : setCertificate;
        let message;

        if (!rules.mimes.includes(file.type)) {
            message = `Unsupported file type. Please upload a ${rules.label} file.`;
        } else if (file.size > MAX_FILE_MB * 1024 * 1024) {
            message = `File is too large. Maximum size is ${MAX_FILE_MB} MB.`;
        }

        if (message) {
            setFile(null);
            setErrors((prev) => ({ ...prev, [key]: message }));
            return;
        }

        setFile(file);
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const removeFile = (key) => {
        if (key === 'pitchDeck') setPitchDeck(null);
        else setCertificate(null);
    };

    // Typed fields use the same rules as the API route; the files are checked here
    const validate = () => {
        const e = validateSubmission(values, declarations);
        if (!pitchDeck) e.pitchDeck = 'Upload your pitch deck (PDF).';
        if (!certificate) e.swaCertificate = 'Upload your SWA registration certificate.';
        return e;
    };

    const focusFirstError = () => {
        requestAnimationFrame(() => {
            const first = formRef.current?.querySelector('[aria-invalid="true"]');
            if (first) {
                smoothScrollTo(first, { center: true });
                first.focus({ preventScroll: true });
            }
        });
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setSubmitError('');

        const validation = validate();
        // keep any file-type errors raised while selecting files
        const merged = {
            ...validation,
            pitchDeck: validation.pitchDeck ?? errors.pitchDeck,
            swaCertificate: validation.swaCertificate ?? errors.swaCertificate,
        };
        setErrors(merged);

        if (Object.values(merged).some(Boolean)) {
            focusFirstError();
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                values,
                declarations,
                website: formRef.current?.elements?.website?.value || '',
            };
            let res;

            if (blobUploads) {
                // 1. Files go straight from the browser to private Blob storage (they are too large
                //    to pass through a Vercel function), 2. the route emails everything with both files attached.
                const send = async (file, kind) => {
                    const { pathname } = await upload(`${SUBMISSION_FOLDER}/${kind}-${safeFileName(file.name)}`, file, {
                        access: 'private',
                        handleUploadUrl: '/api/script-submission/upload',
                        contentType: file.type,
                        multipart: file.size > 5 * 1024 * 1024,
                    });
                    return { pathname, name: file.name };
                };

                setSubmitStage('Uploading your files…');
                const [deck, cert] = await Promise.all([send(pitchDeck, 'pitch-deck'), send(certificate, 'swa-certificate')]);

                setSubmitStage('Sending your submission…');
                res = await fetch('/api/script-submission', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...payload, files: { pitchDeck: deck, swaCertificate: cert } }),
                });
            } else {
                // No Blob store: the files travel with the form itself
                const body = new FormData();
                body.append('payload', JSON.stringify(payload));
                body.append('pitchDeck', pitchDeck);
                body.append('swaCertificate', certificate);

                setSubmitStage('Sending your submission…');
                res = await fetch('/api/script-submission', { method: 'POST', body });
            }

            if (!res.ok) {
                const { error, fields } = await res.json().catch(() => ({}));
                if (fields) {
                    setErrors(fields);
                    focusFirstError();
                }
                throw new Error(error || 'Request failed');
            }

            setSubmitted(true);
            smoothScrollTo(0);
        } catch (err) {
            setSubmitError(
                err?.message && err.message !== 'Request failed' && !/fetch/i.test(err.message)
                    ? err.message
                    : 'Your submission could not be sent. Check your connection and try again.'
            );
        } finally {
            setSubmitStage('');
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setValues(INITIAL_VALUES);
        setDeclarations(INITIAL_DECLARATIONS);
        setPitchDeck(null);
        setCertificate(null);
        setErrors({});
        setSubmitted(false);
    };

    /* ----------------------------- render ----------------------------- */

    return (
        <section ref={containerRef} className="bg-[#FAFAFA]  min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 md:px-8 lg:px-16 overflow-x-hidden">
            <div className=" mx-auto max-sm:pt-[3vh]">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 sm:mb-16 md:mb-24 gap-6 sm:gap-8">
                    <h1 data-entrance="words" className="h2 text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-medium tracking-tighter text-black leading-[1] lg:leading-[0.95]">
                        Script{" "}<br />Submission
                    </h1>
                    <p data-entrance="lines" className="text-[#555] text-sm sm:text-base md:text-lg max-w-md leading-relaxed lg:pb-3">
                        Submit your original screenplay to Mukta Arts and give your story the opportunity to be discovered and considered by our creative team.
                    </p>
                </div>

                {/* Banner Image */}
                {/* <div data-entrance="fade" className="relative w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[480px] overflow-hidden mb-12 sm:mb-16 md:mb-20">
                    <img
                        src="https://images.unsplash.com/photo-1515634928627-2a4e0dae3ddf?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Script writing placeholder"
                        className="object-cover w-full h-full object-center"
                    />
                </div> */}

                {/* Form */}
                {submitted ? (
                    <div className="flex flex-col items-start gap-5 border border-[#202020] bg-white p-8 sm:p-12">
                        <CheckCircle2 className="h-10 w-10 text-black" strokeWidth={1.25} />
                        <h3 className="text-3xl sm:text-4xl font-medium tracking-tight text-black">
                            Script submitted
                        </h3>
                        <p className="text-[#555] text-base leading-relaxed max-w-lg">
                            Thank you, {values.firstName}. Our creative team has received your submission for
                            {' '}<span className="text-black font-medium">{values.title}</span>. We will contact you at {values.email} if your project moves forward.
                        </p>
                        <Button onClick={resetForm} className="mt-2">
                            Submit Another Script
                        </Button>
                    </div>
                ) : (
                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        noValidate
                        aria-busy={submitting}
                    >
                        {/* Locks every field while the submission is being sent */}
                        <fieldset disabled={submitting} className="flex flex-col gap-12 sm:gap-16 w-full min-w-0 m-0 p-0 border-0">
                            {/* ------------------ 1. PERSONAL DETAILS ------------------ */}
                            <FormSection
                                number="01"
                                title="Personal details"
                                note="Tell us who you are and how we can reach you."
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                    <Field label="First name" required error={errors.firstName}>
                                        <IconInput
                                            icon={User}
                                            type="text"
                                            name="firstName"
                                            autoComplete="given-name"
                                            placeholder="example name"
                                            value={values.firstName}
                                            onChange={handleChange}
                                            error={errors.firstName}
                                        />
                                    </Field>

                                    <Field label="Last name" required error={errors.lastName}>
                                        <IconInput
                                            icon={User}
                                            type="text"
                                            name="lastName"
                                            autoComplete="family-name"
                                            placeholder="example name"
                                            value={values.lastName}
                                            onChange={handleChange}
                                            error={errors.lastName}
                                        />
                                    </Field>

                                    <Field label="Email address" required error={errors.email}>
                                        <IconInput
                                            icon={Mail}
                                            type="email"
                                            name="email"
                                            autoComplete="email"
                                            placeholder="example@mail.com"
                                            value={values.email}
                                            onChange={handleChange}
                                            error={errors.email}
                                        />
                                    </Field>

                                    <Field label="Phone number" required error={errors.phone}>
                                        <IconInput
                                            icon={Phone}
                                            type="tel"
                                            name="phone"
                                            autoComplete="tel"
                                            placeholder="123 456 7890"
                                            value={values.phone}
                                            onChange={handleChange}
                                            error={errors.phone}
                                        />
                                    </Field>
                                </div>
                            </FormSection>

                            {/* ------------------ 2. PROJECT DETAILS ------------------ */}
                            <FormSection
                                number="02"
                                title="Project details"
                                note="The essentials of your story: title, format, genre, length and premise."
                            >
                                <Field
                                    label="Screenplay title"
                                    required
                                    hint="Title of the proposed project."
                                    error={errors.title}
                                >
                                    <IconInput
                                        icon={Film}
                                        type="text"
                                        name="title"
                                        placeholder="Enter title"
                                        value={values.title}
                                        onChange={handleChange}
                                        error={errors.title}
                                    />
                                </Field>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                    {/* Format */}
                                    <Field label="Format" required error={errors.format}>
                                        <div
                                            role="radiogroup"
                                            aria-label="Format"
                                            className={`grid grid-cols-2 border ${borderFor(errors.format)}`}
                                        >
                                            {FORMATS.map((f, i) => {
                                                const active = values.format === f;
                                                return (
                                                    <button
                                                        key={f}
                                                        type="button"
                                                        role="radio"
                                                        aria-checked={active}
                                                        aria-invalid={errors.format && i === 0 ? 'true' : undefined}
                                                        onClick={() => handleFormat(f)}
                                                        className={`py-3.5 text-[14px] sm:text-[15px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset ${i === 0 ? 'border-r border-[#202020]' : ''
                                                            } ${active ? 'bg-black text-white' : 'bg-transparent text-black hover:bg-gray-100'}`}
                                                    >
                                                        {f}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </Field>

                                    {/* Genre */}
                                    <Field label="Genre" required error={errors.genre}>
                                        <IconSelect
                                            icon={Tag}
                                            name="genre"
                                            value={values.genre}
                                            onChange={handleChange}
                                            error={errors.genre}
                                        >
                                            <option value="" disabled>
                                                Select genre
                                            </option>
                                            {GENRES.map((g) => (
                                                <option key={g} value={g} className="text-black">
                                                    {g}
                                                </option>
                                            ))}
                                        </IconSelect>
                                    </Field>
                                </div>

                                {values.genre === 'Other' && (
                                    <Field label="Specify genre" required error={errors.genreOther}>
                                        <IconInput
                                            icon={Tag}
                                            type="text"
                                            name="genreOther"
                                            placeholder="Enter genre"
                                            value={values.genreOther}
                                            onChange={handleChange}
                                            error={errors.genreOther}
                                        />
                                    </Field>
                                )}

                                {/* Duration */}
                                {!values.format && (
                                    <Field
                                        label="Duration"
                                        required
                                        hint="Select a format above to enter the duration."
                                    >
                                        <div className="border border-dashed border-gray-300 py-3.5 px-4 text-[14px] text-gray-400">
                                            Feature films: runtime in minutes. Web series: number of episodes and minutes per episode.
                                        </div>
                                    </Field>
                                )}

                                {values.format === 'Feature Film' && (
                                    <Field
                                        label="Duration (minutes)"
                                        required
                                        hint="Approximate runtime of the feature film."
                                        error={errors.runtime}
                                    >
                                        <IconInput
                                            icon={Clock}
                                            type="number"
                                            min="1"
                                            inputMode="numeric"
                                            name="runtime"
                                            placeholder="e.g. 120"
                                            value={values.runtime}
                                            onChange={handleChange}
                                            error={errors.runtime}
                                        />
                                    </Field>
                                )}

                                {values.format === 'Web Series' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                        <Field label="Number of episodes" required error={errors.episodes}>
                                            <IconInput
                                                icon={Hash}
                                                type="number"
                                                min="1"
                                                inputMode="numeric"
                                                name="episodes"
                                                placeholder="e.g. 8"
                                                value={values.episodes}
                                                onChange={handleChange}
                                                error={errors.episodes}
                                            />
                                        </Field>
                                        <Field
                                            label="Duration per episode (minutes)"
                                            required
                                            hint="Approximate duration of each episode."
                                            error={errors.episodeDuration}
                                        >
                                            <IconInput
                                                icon={Clock}
                                                type="number"
                                                min="1"
                                                inputMode="numeric"
                                                name="episodeDuration"
                                                placeholder="e.g. 45"
                                                value={values.episodeDuration}
                                                onChange={handleChange}
                                                error={errors.episodeDuration}
                                            />
                                        </Field>
                                    </div>
                                )}

                                {/* Logline */}
                                <Field
                                    label="Logline"
                                    required
                                    hint="A concise, compelling summary of the story in 1–3 sentences."
                                    error={errors.logline}
                                >
                                    <IconTextarea
                                        icon={Quote}
                                        rows="3"
                                        name="logline"
                                        maxLength={LOGLINE_MAX}
                                        placeholder="Your story in 1–3 sentences..."
                                        value={values.logline}
                                        onChange={handleChange}
                                        error={errors.logline}
                                    />
                                    <p className="text-[12px] text-gray-400 text-right -mt-1">
                                        {values.logline.length}/{LOGLINE_MAX}
                                    </p>
                                </Field>

                                {/* Synopsis */}
                                <Field
                                    label="Synopsis"
                                    required
                                    hint="Outline the central premise, key characters, main conflict and narrative direction."
                                    error={errors.synopsis}
                                >
                                    <IconTextarea
                                        icon={PenLine}
                                        rows="8"
                                        name="synopsis"
                                        maxLength={SYNOPSIS_MAX}
                                        placeholder="Text here..."
                                        value={values.synopsis}
                                        onChange={handleChange}
                                        error={errors.synopsis}
                                    />
                                    <p className="text-[12px] text-gray-400 text-right -mt-1">
                                        {values.synopsis.length}/{SYNOPSIS_MAX}
                                    </p>
                                </Field>
                            </FormSection>

                            {/* ------------------ 3. REQUIRED DOCUMENTS ------------------ */}
                            <FormSection
                                number="03"
                                title="Required documents"
                                note="All documents listed below are mandatory. Incomplete submissions will not be considered."
                            >
                                <Field
                                    label="A. Pitch deck"
                                    required
                                    hint="Introduce the project, its central premise, key characters, narrative direction and creative vision."
                                    error={errors.pitchDeck}
                                >
                                    <FileDropzone
                                        file={pitchDeck}
                                        accept=".pdf,application/pdf"
                                        formatLabel={PITCH_DECK_RULES.label}
                                        error={errors.pitchDeck}
                                        onSelect={(f) => handleFile('pitchDeck', f, PITCH_DECK_RULES)}
                                        onRemove={() => removeFile('pitchDeck')}
                                        disabled={submitting}
                                    />
                                </Field>

                                <Field label="B. SWA registration number" required error={errors.swaNumber}>
                                    <IconInput
                                        icon={BadgeCheck}
                                        type="text"
                                        name="swaNumber"
                                        placeholder="Enter registration number"
                                        value={values.swaNumber}
                                        onChange={handleChange}
                                        error={errors.swaNumber}
                                    />
                                </Field>

                                <Field
                                    label="C. SWA registration certificate"
                                    required
                                    hint=""
                                    error={errors.swaCertificate}
                                >
                                    <FileDropzone
                                        file={certificate}
                                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                                        formatLabel={CERTIFICATE_RULES.label}
                                        error={errors.swaCertificate}
                                        onSelect={(f) => handleFile('swaCertificate', f, CERTIFICATE_RULES)}
                                        onRemove={() => removeFile('swaCertificate')}
                                        disabled={submitting}
                                    />
                                </Field>
                            </FormSection>

                            {/* ------------------ 4. LEGAL DISCLAIMER (optional) ------------------ */}
                            {hasLegal && (
                                <FormSection number="04" title="Legal disclaimer">
                                    <div className="form-element border border-[#202020] bg-white p-5 sm:p-6 max-h-72 overflow-y-auto flex flex-col gap-3" data-lenis-prevent>
                                        {LEGAL_DISCLAIMER.map((para, i) => (
                                            <p key={i} className="text-[13px] sm:text-[14px] text-[#555] leading-relaxed">
                                                {para}
                                            </p>
                                        ))}
                                    </div>
                                </FormSection>
                            )}

                            {/* ------------------ DECLARATION AND CONFIRMATION ------------------ */}
                            <FormSection
                                number={declarationNumber}
                                title="Declaration and confirmation"
                                note="Before submitting, confirm the following. All declarations are mandatory."
                            >
                                <div className="form-element flex flex-col gap-4">
                                    {DECLARATIONS.map(({ key, text }, i) => (
                                        <label key={key} className="flex items-start gap-3.5 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={declarations[key]}
                                                onChange={() => handleDeclaration(key)}
                                                aria-required="true"
                                                aria-invalid={errors.declarations && !declarations[key] && i === 0 ? 'true' : undefined}
                                                className="mt-0.5 h-5 w-5 shrink-0 accent-black cursor-pointer"
                                            />
                                            <span className="text-[14px] sm:text-[15px] text-[#555] leading-relaxed group-hover:text-black transition-colors">
                                                {text}
                                                <span className="text-red-600 ml-0.5" aria-hidden="true">*</span>
                                            </span>
                                        </label>
                                    ))}
                                    {errors.declarations && (
                                        <p className="text-[13px] text-red-600">{errors.declarations}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                {submitError && (
                                    <p role="alert" className="form-element text-[14px] text-red-600">
                                        {submitError}
                                    </p>
                                )}
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="form-element mt-2 sm:mt-4 w-full"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Script'}
                                </Button>
                                {submitStage && (
                                    <p aria-live="polite" className="text-[13px]! text-[#555]">{submitStage}</p>
                                )}
                                {/* Spam trap: hidden from people, filled in by bots */}
                                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                            </FormSection>
                        </fieldset>
                    </form>
                )}
            </div>
        </section>
    );
};

export default SubmitScriptPage;