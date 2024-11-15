import React from 'react'

export default function ProfileField({ label, value }) {
  return (
    <>
          <div className="flex flex-col gap-1 ">
    <span className="text-gray-600 text-sm ">{label}*</span>
    <h1 className="text-black text-base">{value || "Unavailable*"}</h1>
  </div>
    </>
  )
}
