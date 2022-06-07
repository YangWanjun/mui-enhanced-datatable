import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  error: {
    color: 'red',
  },
}));

function NonFieldErrors(props) {
  const classes = useStyles();
  let { errors } = props;
  if (typeof errors === 'string') {
    errors = [errors];
  }

  return (
    <React.Fragment>
      {Array.isArray(errors) && errors.length > 0 ? (
        <ul className={classes.error}>
          {errors.map((error, key) => (
            <li key={key}>
              {error}
            </li>
          ))}
        </ul>
      ) : null}
    </React.Fragment>
  );
}

export default NonFieldErrors;
