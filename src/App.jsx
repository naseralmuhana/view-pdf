import React, { useRef, useState } from "react"
import { Viewer, Worker } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"

import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import "@react-pdf-viewer/core/lib/styles/index.css"

const saveFileLocalStorage = (data) => {
  localStorage.setItem("pdfFile", JSON.stringify(data))
}
const saveNameLocalStorage = (data) => {
  localStorage.setItem("pdfFileName", JSON.stringify(data))
}
const retrieveLocalStorage = (label) => {
  const localPdfFile = JSON.parse(localStorage.getItem(label))
  return localPdfFile ? localPdfFile : null
}

const App = () => {
  const [viewPdf, setViewPdf] = useState(retrieveLocalStorage("pdfFile"))
  let pdfFileName = retrieveLocalStorage("pdfFileName")
  const fileType = ["application/pdf"]
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const inputRef = useRef(null)
  const handleFileInputChange = (e) => {
    let selectedFile = e.target.files[0]
    if (selectedFile) {
      if (fileType.includes(selectedFile.type)) {
        saveNameLocalStorage(selectedFile.name)
        let reader = new FileReader()
        reader.readAsDataURL(selectedFile)
        reader.onload = (e) => {
          setViewPdf(e.target.result)
          saveFileLocalStorage(e.target.result)
        }
      } else {
        setViewPdf(null)
      }
    } else {
      console.log("Please select a file")
    }
  }
  console.log(inputRef)
  return (
    <>
      <div className="container mt-3">
        <form>
          <input
            ref={inputRef}
            className="form-control"
            type="file"
            id="formFile"
            onChange={handleFileInputChange}
          />
        </form>
      </div>
      <div className="container pdf-container my-3">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.1.81/build/pdf.worker.min.js">
          {viewPdf ? (
            <Viewer fileUrl={viewPdf} plugins={[defaultLayoutPluginInstance]} />
          ) : (
            <h2>No PDF</h2>
          )}
        </Worker>
      </div>
    </>
  )
}

export default App
