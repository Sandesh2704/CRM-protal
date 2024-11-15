import React from 'react'

export default function TextInput({ type, placeholder, label, name, value, inputHandler }) {
  return (
    <div className="w-full">
      <label className="text-theme1 font-medium ">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={inputHandler}
        className="text-theme1 placeholder:text-zinc-500 mt-4 outline-none bg-white w-full text-sm text-gray-900 py-[16px] px-6 rounded-sm border " />
    </div>
  )
}
