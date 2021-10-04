import React from "react";
import PropTypes from 'prop-types';

const ProfileImage = (props) => {

    return(
        <div className="image-holder">
          <img src={props.url} alt="profile-image" />
        </div>
    );
}

ProfileImage.protoTypes = {
    url: PropTypes.string.isRequired
}

export default ProfileImage;