// This file is part of MinIO Kubernetes Cloud
// Copyright (c) 2020 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress
} from "@material-ui/core";
import api from "../../../common/api";
import { PolicyList } from "./types";
import Typography from "@material-ui/core/Typography";

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red"
    }
  });

interface IDeletePolicyProps {
  classes: any;
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedPolicy: string;
}

interface IDeletePolicyState {
  deleteLoading: boolean;
  deleteError: string;
}

class DeletePolicy extends React.Component<
  IDeletePolicyProps,
  IDeletePolicyState
> {
  state: IDeletePolicyState = {
    deleteLoading: false,
    deleteError: ""
  };
  removeRecord() {
    const { deleteLoading } = this.state;
    const { selectedPolicy } = this.props;
    if (deleteLoading) {
      return;
    }
    this.setState({ deleteLoading: true }, () => {
      api
        .invoke("DELETE", `/api/v1/policies/${selectedPolicy}`)
        .then((res: PolicyList) => {
          this.setState(
            {
              deleteLoading: false,
              deleteError: ""
            },
            () => {
              this.props.closeDeleteModalAndRefresh(true);
            }
          );
        })
        .catch(err => {
          this.setState({
            deleteLoading: false,
            deleteError: err
          });
        });
    });
  }
  render() {
    const { classes, deleteOpen, selectedPolicy } = this.props;
    const { deleteLoading, deleteError } = this.state;
    return (
      <Dialog
        open={deleteOpen}
        onClose={() => {
          this.setState({ deleteError: "" }, () => {
            this.props.closeDeleteModalAndRefresh(false);
          });
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Bucket</DialogTitle>
        <DialogContent>
          {deleteLoading && <LinearProgress />}
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete policy <b>{selectedPolicy}</b>?.
            {deleteError !== "" && (
              <React.Fragment>
                <br />
                <Typography
                  component="p"
                  variant="body1"
                  className={classes.errorBlock}
                >
                  {deleteError}
                </Typography>
              </React.Fragment>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              this.setState({ deleteError: "" }, () => {
                this.props.closeDeleteModalAndRefresh(false);
              });
            }}
            color="primary"
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              this.removeRecord();
            }}
            color="secondary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(DeletePolicy);
