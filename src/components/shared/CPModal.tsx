import {Dialog, DialogContent, DialogProps, DialogTitle, Typography} from "@material-ui/core";
import React from "react";

interface CPModalProps extends DialogProps {
    title: string,
    message: string
}

const CPModal: React.FC<CPModalProps> = ({title, message, ...props}) => (
    <Dialog {...props}>
        <DialogTitle>
            <Typography variant={"h5"} style={{fontWeight: "bold"}}>{title}</Typography>
        </DialogTitle>
        <DialogContent style={{paddingBottom: "20px"}}>
            <Typography variant={"body1"}>{message}</Typography>
        </DialogContent>
    </Dialog>
)

export default CPModal;