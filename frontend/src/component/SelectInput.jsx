import React from 'react'

export default function SelectInput({ label, name, value, inputHandler, options }) {
  return (
    <div>
        <div className="">
      <label className="text-theme1 font-medium">{label}</label>
      <select
        name={name}
        value={value}
        onChange={inputHandler}
        className="text-theme1 placeholder:text-zinc-500 mt-4 outline-none bg-white w-full text-sm text-gray-900 py-[16px] px-6 rounded-sm border"
      >
        <option value="" disabled>Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
    </div>
  )
}
