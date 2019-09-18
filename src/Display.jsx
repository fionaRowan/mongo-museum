import React, { useRef, useEffect } from 'react';

const Display = (props) => {
    const container = useRef(null);

    useEffect(() => {
      if (props.setChildRef) {
        props.setChildRef(container);
      }
    }, [])

    return (
        <svg
            ref={container}
        />
    )
}

export default Display
