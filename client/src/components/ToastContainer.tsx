import {
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiInfo,
  FiX,
} from "react-icons/fi";

import { useToastStore } from "../stores/useToastStore";


export default function ToastContainer() {


  const {
    toasts,
    removeToast,
  } = useToastStore();



  const icons = {

    success:
      <FiCheckCircle size={20}/>,

    error:
      <FiXCircle size={20}/>,

    warning:
      <FiAlertTriangle size={20}/>,

    info:
      <FiInfo size={20}/>,

  };



  const styles = {

    success:
      "border-green-200 bg-green-50 text-green-700",

    error:
      "border-red-200 bg-red-50 text-red-700",

    warning:
      "border-yellow-200 bg-yellow-50 text-yellow-700",

    info:
      "border-blue-200 bg-blue-50 text-blue-700",

  };



  return (

    <div
      className="
      fixed
      top-5
      right-5
      z-[9999]
      flex
      flex-col
      gap-3
      "
    >


      {
        toasts.map((toast)=>(

          <div
            key={toast.id}
            className={`
              w-96
              rounded-xl
              border
              shadow-lg
              p-4
              flex
              gap-3
              items-start
              animate-in
              slide-in-from-right
              duration-300
              ${styles[toast.type]}
            `}
          >


            <div className="mt-1">
              {icons[toast.type]}
            </div>



            <div className="flex-1">


              <h4
                className="
                font-semibold
                text-sm
                "
              >
                {toast.title}
              </h4>



              {
                toast.message && (

                  <p
                    className="
                    text-xs
                    mt-1
                    opacity-80
                    "
                  >
                    {toast.message}
                  </p>

                )
              }


            </div>




            <button
              onClick={() =>
                removeToast(toast.id)
              }
              className="
              opacity-60
              hover:opacity-100
              "
            >

              <FiX size={16}/>

            </button>


          </div>

        ))
      }


    </div>

  );
}