import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { grey } from "@material-ui/core/colors";
import DeleteIcon from '@material-ui/icons/Delete';
import CachedIcon from '@material-ui/icons/Cached';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

const useStyles = makeStyles({
  root: {
    paddingTop : '-50px',
    minWidth: 275,
    paddingLeft : '10px',
    marginLeft : 220,
    marginRight : 10,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
     
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

export default function OutlinedCard() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card style={{backgroundColor: "lightgrey"}} className={classes.root} variant="outlined">
      {/* <CardContent> */}
      <Typography
        variant="subtitle"
        className={classes.title}
        color="textSecondary"
        gutterBottom
      >
        <Button size="small" startIcon={<CheckBoxOutlineBlankIcon/>}>Select All</Button>
        <Button size="small" startIcon={<DeleteIcon />}>Delete</Button>
        <Button size="small" startIcon = {<CachedIcon/>}>Refresh</Button>
      </Typography>
      {/* <Typography variant="h5" component="h2">
          be{bull}nev{bull}o{bull}lent
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          adjective
        </Typography>
        <Typography variant="body2" component="p">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography> */}
      {/* </CardContent> */}
      {/* <CardActions> */}
      {/* <Button size="small">Learn More</Button> */}
      {/* </CardActions> */}
    </Card>
  );
}
