import { Check } from 'lucide-react';
/** Native inputs retain autofill, keyboard selection and RHF's focus management. */
export function FloatingField({name,label,register,rules,error,value,submitted,type='text',inputMode,autoComplete,prefix,multiline=false,required=false}){
  const Tag=multiline?'textarea':'input',valid=!!value&&!error;
  return <div className={multiline?'sm:col-span-2':''}>
    <div className={`appointment-field relative rounded-2xl ${error?'is-invalid':''} ${value||type==='date'?'has-value':''} ${prefix?'has-prefix':''}`}>
      {prefix&&<span className="absolute left-4 top-6 rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-600">{prefix}</span>}
      <Tag id={`appointment-${name}`} {...register(name,rules)} type={multiline?undefined:type} inputMode={inputMode} autoComplete={autoComplete} placeholder=" " required={required} maxLength={name==='phone'?10:name==='message'?2000:200} rows={multiline?4:undefined} aria-invalid={!!error} aria-describedby={error?`appointment-${name}-error`:undefined} className={`peer relative z-10 w-full rounded-2xl border border-transparent bg-transparent pb-3 pt-7 text-base text-forest outline-none ${prefix?'pl-20':'pl-4'} pr-10 ${multiline?'min-h-32 resize-y':'min-h-16'}`}/>
      <label htmlFor={`appointment-${name}`} className="floating-label pointer-events-none absolute left-4 top-5 z-10 text-base text-ink/60">{label}{required&&<span aria-hidden="true"> *</span>}</label>
      {valid&&<Check aria-hidden="true" size={15} className="pointer-events-none absolute right-4 top-7 text-brand-500"/>}
    </div>
    {error&&<p id={`appointment-${name}-error`} role={submitted?'alert':undefined} className="mt-2 px-1 text-xs leading-5 text-[#B44854]">{error.message}</p>}
  </div>;
}
