import React from "react";
import PropTypes from "prop-types";

const SuccessMessage = ({ data, onBackClick }) =>
  <div className="message success">
    <h4>Submission Allowed</h4>
    <p>
      You can do anything you want with the data now, such as submit to a
      backend with Ajax.
    </p>
    <p className="json">
      {data}
    </p>
    <button onClick={onBackClick}>Show Form</button>
  </div>;

SuccessMessage.propTypes = {
  data: PropTypes.string.isRequired,
  onBackClick: PropTypes.func.isRequired
};

export default SuccessMessage;
