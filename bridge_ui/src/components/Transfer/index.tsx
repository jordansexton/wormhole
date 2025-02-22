import {
  Container,
  makeStyles,
  Step,
  StepButton,
  StepContent,
  Stepper,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useCheckIfWormholeWrapped from "../../hooks/useCheckIfWormholeWrapped";
import useFetchTargetAsset from "../../hooks/useFetchTargetAsset";
import useGetBalanceEffect from "../../hooks/useGetBalanceEffect";
import {
  selectTransferActiveStep,
  selectTransferIsRedeemComplete,
  selectTransferIsRedeeming,
  selectTransferIsSendComplete,
  selectTransferIsSending,
} from "../../store/selectors";
import { setStep } from "../../store/transferSlice";
import Recovery from "./Recovery";
import Redeem from "./Redeem";
import RedeemPreview from "./RedeemPreview";
import Send from "./Send";
import SendPreview from "./SendPreview";
import Source from "./Source";
import SourcePreview from "./SourcePreview";
import Target from "./Target";
import TargetPreview from "./TargetPreview";
// TODO: ensure that both wallets are connected to the same known network
// TODO: loaders and such, navigation block?
// TODO: refresh displayed token amount after transfer somehow, could be resolved by having different components appear
// TODO: warn if amount exceeds balance

const useStyles = makeStyles(() => ({
  rootContainer: {
    backgroundColor: "rgba(0,0,0,0.2)",
  },
}));

function Transfer() {
  const classes = useStyles();
  useCheckIfWormholeWrapped();
  useFetchTargetAsset();
  useGetBalanceEffect("target");
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const dispatch = useDispatch();
  const activeStep = useSelector(selectTransferActiveStep);
  const isSending = useSelector(selectTransferIsSending);
  const isSendComplete = useSelector(selectTransferIsSendComplete);
  const isRedeeming = useSelector(selectTransferIsRedeeming);
  const isRedeemComplete = useSelector(selectTransferIsRedeemComplete);
  const preventNavigation = isSending || isSendComplete || isRedeeming;
  useEffect(() => {
    if (preventNavigation) {
      window.onbeforeunload = () => true;
      return () => {
        window.onbeforeunload = null;
      };
    }
  }, [preventNavigation]);
  return (
    <Container maxWidth="md">
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        className={classes.rootContainer}
      >
        <Step
          expanded={activeStep >= 0}
          disabled={preventNavigation || isRedeemComplete}
        >
          <StepButton onClick={() => dispatch(setStep(0))}>Source</StepButton>
          <StepContent>
            {activeStep === 0 ? (
              <Source setIsRecoveryOpen={setIsRecoveryOpen} />
            ) : (
              <SourcePreview />
            )}
          </StepContent>
        </Step>
        <Step
          expanded={activeStep >= 1}
          disabled={preventNavigation || isRedeemComplete}
        >
          <StepButton onClick={() => dispatch(setStep(1))}>Target</StepButton>
          <StepContent>
            {activeStep === 1 ? <Target /> : <TargetPreview />}
          </StepContent>
        </Step>
        <Step expanded={activeStep >= 2} disabled={isSendComplete}>
          <StepButton onClick={() => dispatch(setStep(2))}>
            Send tokens
          </StepButton>
          <StepContent>
            {activeStep === 2 ? <Send /> : <SendPreview />}
          </StepContent>
        </Step>
        <Step expanded={activeStep >= 3}>
          <StepButton
            onClick={() => dispatch(setStep(3))}
            disabled={!isSendComplete}
          >
            Redeem tokens
          </StepButton>
          <StepContent>
            {isRedeemComplete ? <RedeemPreview /> : <Redeem />}
          </StepContent>
        </Step>
      </Stepper>
      <Recovery
        open={isRecoveryOpen}
        setOpen={setIsRecoveryOpen}
        disabled={preventNavigation}
      />
    </Container>
  );
}

export default Transfer;
