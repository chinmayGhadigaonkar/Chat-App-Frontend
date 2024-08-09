import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";

// Define the type for the error object
interface ErrorItem {
  isError: boolean;
  error: any; // Adjust the type as needed based on the error structure
  fallback?: () => void;
}

const useError = (errors: ErrorItem[] = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) {
          fallback();
        } else {
          enqueueSnackbar(error?.message || "Something went wrong", {
            variant: "error"
          });
        }
      }
    });
  }, [errors]);
};


type Handlers = {
  [event: string]: (...args: any[]) => void;
};

const useSocketEvent = (socket: any, handlers:Handlers) => {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      //  console.log(event, handler);
        // console.log(handler);
        
      socket.on(event, handler);
    });


    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, handlers]);
};



export { useError, useSocketEvent };
