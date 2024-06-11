import { Button } from "components";
import { icons } from "utils/constants";

const Abstract = () => {
  return (
    <div className="row mt-3">
      <div className="col-md-8">
        <div className="shadow">
          <div className="cps-28 cpt-16 cpb-16 text-22-500 color-3d3d bb-e3e3">
            Abstract
          </div>
          <div className="cps-28 cpe-28 cpt-28 cpb-28">
            <div className="text-16-400 color-3d3d">
              Ensembles of ultra-cold atoms have been proven to be versatile
              tools for high precision sensing applications. Here, we present a
              method for the manipulation of the state of trapped clouds of
              ultra-cold bosonic atoms. In particular, we discuss the creation
              of coherent and squeezed states of quasiparticles and the coupling
              of quasiparticle modes through an external cavity field. This
              enables operations like state swapping and beam splitting which
              can be applied to realize a Mach–Zehnder interferometer (MZI) in
              frequency space. We present two explicit example applications in
              sensing: the measurement of the healing length of the condensate
              with the MZI scheme, and the measurement of an oscillating force
              gradient. Furthermore, we calculate fundamental limitations based
              on parameters of state-of-the-art technology.
            </div>
            <div className="fa-center gap-3 mt-3">
              <Button
                btnText="Dowload Predio"
                btnStyle="SD"
                onClick={() => {}}
                leftIcon={icons.lightDownload}
              />
              <Button
                btnText="Cite this Article"
                btnStyle="SO"
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="shadow">
          <div className="cps-28 cpt-20 cpb-20 text-28-500 color-7070 bb-e3e3">
            Related Publication
          </div>
          <div className="cps-28 cpe-28 cpt-28 cpb-28">
            <div className="text-18-500 color-3d3d">
              The NTT DCASE2020 Challenge Task 6 system: Automated Audio
              Captioning with Keywords and Sentence Length Estimation
            </div>
            <div className="fa-center gap-3 mt-2">
              <Button
                btnText="Abstract"
                btnStyle="GD"
                onClick={() => {}}
                className="ps-4 pe-4 text-13-400 lh-21 h-32"
              />
              <Button
                btnText="Full-text available"
                btnStyle="PO"
                onClick={() => {}}
                className="text-13-400 lh-21 h-32"
              />
            </div>
            <div className="d-flex mt-3">
              <Button
                btnText="Dowload Predio"
                btnStyle="SO"
                onClick={() => {}}
                leftIcon={icons.downloadArrow}
              />
            </div>
          </div>
          <div className="text-center bg-f0f0 pt-2 pb-2">
            <span className="pointer text-14-400 lh-21 color-5555 text-decoration-underline">
              View more
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Abstract;
