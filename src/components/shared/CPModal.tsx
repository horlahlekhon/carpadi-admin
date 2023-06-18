import {Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Typography} from "@material-ui/core";
import React from "react";
import ErrorIcon from '@material-ui/icons/Error';
import DoneIcon from '@material-ui/icons/Done';
import WarningIcon from '@material-ui/icons/Warning';
import {t} from "../../styles/theme";

interface CPModalProps extends DialogProps {
    title: string,
    message: string,
    type?: string,
}

const CPModal: React.FC<CPModalProps> = ({title, message, type, ...props}) => (
    <Dialog {...props}>
        <DialogTitle style={{}}>
            <Typography variant={"h5"}
                        style={{
                            fontWeight: "bold",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                {type === "error" ? <ErrorIcon/> : (type === "warning" ? <WarningIcon/> : <DoneIcon/>)}
                <>{title}</>
            </Typography>
        </DialogTitle>
        <DialogContent style={{paddingBottom: "20px"}}>
            <Typography variant={"body1"}>{message}</Typography>
        </DialogContent>
        {/*<DialogActions>*/}
        {/*    <Button onClick={handleClose} color="primary" autoFocus>*/}
        {/*        Okay*/}
        {/*    </Button>*/}
        {/*</DialogActions>*/}
    </Dialog>
)

export default CPModal;