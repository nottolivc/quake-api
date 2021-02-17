import { useState, useEffect, useRef } from "react";


// custom form hook, and other methods for condensing state down for api calls?
  // const handleSubmit = (event) => { 
  //   const { latitude, longitude, radius, magnitude, start, end, location } = formData
  //   event.preventDefault() 
  //   console.log(event)
  // }

  // const handleChange = (event) => { 
  //   setFormData({ 
  //     [event.target.name] : event.target.value
  //   }) 
  // }


const formHook = ({
    initialValues,
    onSubmit
}) => {
    const [values, setValues] = useState(initialValues || {});
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [onSubmitting, setOnSubmitting] = useState(false);
    const [onBlur, setOnBlur] = useState(false);

    const formRendered = useRef(true);

    useEffect(() => {
    if (formRendered.current) {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setOnSubmitting(false);
        setOnBlur(false);
    }
    formRendered.current = false;
    }, [initialValues]);

    const handleChange = (event) => {
    const { target } = event;
    const { name, value } = target;
    event.persist();
    setValues({ ...values, [name]: value });
};

    const handleBlur = (event) => {
    const { target } = event;
    const { name } = target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors });
};

    const handleSubmit = (event) => {
    if (event) event.preventDefault();
    setErrors({ ...errors });
    onSubmit({ values, errors });
    };

    return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit
    };
};

export default formHook;