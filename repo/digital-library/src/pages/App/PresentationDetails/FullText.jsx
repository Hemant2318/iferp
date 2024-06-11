import { Button } from "components";
import { icons } from "utils/constants";

const FullText = () => {
  return (
    <div className="shadow">
      <div className="cps-28 cpt-16 cpb-16 text-22-500 color-3d3d bb-e3e3">
        Article
      </div>
      <div className="cps-28 cpe-28 cpt-28 cpb-28">
        <div className="text-16-400 color-3d3d">
          1. Introduction The development of atom trapping and cooling
          technology has led to an explosion of applications in many areas of
          physics. One of the most well-known applications of control on the
          single atom scale is the atomic clock, which helped define the second
          in terms of the fundamental constants of nature [1]. Cold atoms are
          also used for quantum simulation, studying models from condensed
          matter [2] as well as artificial gauge fields [3] and other exotic
          topological states [4]. Matter-wave interferometry with cold atoms has
          been applied to sensing applications such as the measurement of
          gravitational fields [5–8] and precision tests of fundamental physics,
          such as measuring Newton's gravitational constant [9] and the fine
          structure constant [10] and testing the equivalence principle [11,
          12], as well as physics beyond the standard model [13]. When a
          three-dimensional cloud of atoms is cooled to such a degree that a
          macroscopic fraction of the atoms fall into the motional ground state,
          they condense into a Bose–Einstein condensate (BEC). Strictly
          speaking, in lower dimensions, Bose–Einstein condensation does not
          occur. Instead, quasi-condensates form that do not exhibit the
          long-range order of a BEC. Unless we explicitly refer to BECs or
          quasi-condensates, we will use the term condensate for both in the
          following. Condensates of ultra-cold atoms can be used to push the
          sensitivity of the fundamental physics tests mentioned above even
          further [14–19], even to applications in extraterrestrial space [20,
          21]. The interaction between the atoms in the condensate leads to
          low-energy quasiparticles taking the form of phonons, i.e. quantised
          sound waves. Phonons are extensively studied in the field of quantum
          simulation [22–25], analogue gravity including the simulation of event
          horizons [26–28], cosmic inflation [29] and gravitational waves [30,
          31]. Collective oscillations of condensates may also be used for
          sensing applications as demonstrated by the measurement of the thermal
          Casimir–Polder force presented in [32, 33]. Further proposals include
          force sensing [34], gravimetry [35, 36], tests of gravitationally
          induced collapse models [37] and even gravitational wave detection
          [38–42]. Collective oscillations in BECs have been already studied in
          early experiments [43–45] and it has been demonstrated that highly
          excited quasi-particle states can be created with light pulses [46]
          and periodic modulations of the trap potential [25, 47]. Readout
          methods for quasiparticle excitations of condensates include
          self-interference of the Bose gas after release from the trap denoted
          as heterodyning [46] or time-of-flight measurements (e.g. [48]) and in
          situ phase contrast imaging [45, 49]. An alternative approach for
          creating, manipulating and reading out quasiparticle states of a
          condensate is based on cavity optomechanics. The coupling of optical
          cavity modes to BECs has already been experimentally achieved more
          than a decade ago [50, 51] and many more experiments with ultra-cold
          atoms have been performed since (see, e.g. [52], and the recent
          experiment with a Fermi gas [53]). A comprehensive review of cavity
          optomechanics with ultra-cold atoms is given in [54] and the relation
          of this field to cavity optomechanics with macroscopic oscillators has
          been reviewed extensively in [55]. In this article, we discuss the
          coupling of two modes with interactions that are reminiscent of beam
          splitters and mirrors and single- and two-mode squeezing of
          quasiparticle modes of ensembles of ultra-cold atoms based on
          temporally modulated light potentials in optical cavities. Our
          manuscript is organized as follows: we introduce the cavity-condensate
          coupling in section 2, our proposed approach for state manipulation in
          section 3, and restrict to the simple case of box-shaped traps in
          section 4. In section 5, we present a Mach–Zehnder interferometer
          (MZI) and two potential applications as examples of how to use our
          state manipulation scheme. We discuss damping, example values for
          parameters and readout mechanisms in section 6 and conclude our
          findings in section 7. 2. Dynamics of the composite system We begin by
          considering a condensate trapped in an external potential within a
          Fabry–Pérot type optical cavity (see figure 1). The cavity is employed
          for the restriction to standing light wave modes. This is, in
          principle, not necessary for the general mechanisms of quasiparticle
          state manipulation presented. In principle, the same can be achieved
          by any temporally modulated tailored potentials. However, the
          restriction to cavity fields makes the discussion more concrete and
          the calculations simpler. The trap is considered to be elongated and
          the orientation of the cavity is considered to be aligned with the
          elongated axis of the condensate and the z-direction. Then, we
          restrict our considerations to quasiparticle modes in the elongated
          direction of the trap and treat the system in a one-dimensional way
          considering an effective cross sectional area of the condensate. This
          approximation is valid if the parameters and the geometry of the setup
          are chosen such that the coupling of the modes in the elongated
          direction to those in the transverse directions is sufficiently
          suppressed, for example, in the case of very tight transverse
          confinement (as considered below in section 6.2). Zoom In Zoom Out
          Reset image size Figure 1. The setup considered in this paper is an
          ultra-cold atomic ensemble in an elongated trap which is effectively
          box-like in the elongated direction. The atomic ensemble is placed
          inside a Fabry–Pérot cavity to interact with a laser field in the
          cavity. Download figure: Standard image High-resolution image The time
          evolution of the total system is described by the Hamiltonian is the
          cavity field Hamiltonian, is the coupling of light and atomic cloud
          that we will introduce below and the Hamiltonian that describes the
          time-evolution of the atomic cloud is Equation (1) where ma is the
          atomic mass and is the atom-atom interaction strength. V0 is the trap
          potential and δVext includes all other external potentials that may
          affect the condensate; for example, an external gravitational
          potential. We assume that δVext can be considered to be small in
          comparison to the trapping potential and only changes the density
          distribution of the condensate slightly. Later, we will consider the
          sensing of δVext via its effect on the condensate as a specific
          application. The one-dimensional description represented by can be
          directly derived from the three-dimensional standard description of
          interacting Bose gases [56]. For example, in the case of a
          three-dimensional condensate in a three-dimensional box trap with a
          box-shaped ground state [57], where g = 4πℏ2 asc/ma is the 3D coupling
          constant parameterised by the s-wave scattering length asc. Another
          possibility is to assume a strong harmonic transverse trap potential
          (such that the atoms are transversely mostly in the trap's ground
          state) which leads to a Gaussian shape of the condensate in the
          transverse direction and a one-dimensional quasi-condensate implying,
          where is the transverse oscillator length given by the transverse
          trapping frequency ω⊥. Then, the Hamiltonian (3) is an approximation
          that corresponds to the case of a low one-dimensional density of the
          condensate such that ρ1D asc ≪ 1 (see e.g. [24, 58]). For ρ1D asc  ≳
           1, we would need to replace by more complicated functions of (see
          e.g. [24, 58]). For the sake of simplicity we refrain from this here.
          Note that asc can, in general, be widely tuned for some atom species
          that possess Feshbach resonances (e.g. 23Na [59], 85Rb [60] and 87Rb
          [61]) by employing strong magnetic fields to modify the s-wave
          scattering length. Unfortunately, also the three-body loss rate is
          strongly enhanced near a Feshbach resonance (see also [62]), where
          three-body loss is a significant limitating factor for the maximal
          experimental time considered in this paper. Therefore, Feshbach
          resonances are of little use for our proposal and will not be
          considered. 2.1. Light–matter coupling and full potential We consider
          a single optical cavity mode with annihilation and creation operators
          and respectively, and free evolution with that is coupled to the
          atomic field operator via the dispersive coupling Hamiltonian (photon
          absorption and stimulated re-emission) [55, 63] Equation (2) To
          achieve this form of coupling, the cavity mode frequency is chosen
          close to an atomic resonance with a detuning ΔA and the single photon
          Rabi frequency, where d is the atomic dipole moment along the cavity
          mode polarization, is the effective cavity mode volume, is the
          effective cross sectional area of the cavity mode and fcav(z) is the
          cavity mode function. We assume that the cavity mode is driven by a
          strong laser field with frequency ω = ωc + Δc, and we move into the
          corresponding rotating frame. This allows us to treat the cavity field
          perturbatively by splitting the mode operators into their expectation
          values and fluctuations as [64, 65]. Since is invariant under phase
          factors, without loss of generality, we consider as real valued and
          set, where Nph is the number of photons in the cavity mode. The photon
          number is related to the circulating power in the cavity as Pc = ℏωc
          Nph c/(2Lc), where c is the speed of light and Lc is the length of the
          cavity. Pc can be varied by modulating the cavity pump power on time
          scales much larger than the life time of photons in the cavity mode.
          This is the basis for the state manipulation of the quasiparticles
          that we present in this work, and in the following, we consider Nph as
          generally time-dependent. Introducing the split into and neglecting
          the second order term in, we obtain [64] Equation (3) where the full
          potential acting on the condensate is Equation (4) We restrict our
          considerations to situations where δV oscillates around a mean. We
          split δV into its time-average and the purely oscillating part. Later
          we will assume that Vosc oscillates on resonance with a quasiparticle
          excitation or quasiparticle transitions. Therefore, we can already
          conclude that modifies the stationary condensate ground state and the
          quasiparticle mode functions, while Vosc drives the quasiparticle
          modes. We will discard the last term in (3) in the following as, for
          the moment, we are only interested in the effect of the strong light
          field on the quasiparticle modes. The back-action on the light field
          will only become relevant again in appendix D.1, where we discuss a
          potential scheme for the readout of the quasiparticle states.
        </div>
        <div className="f-center gap-3 mt-3">
          <Button
            btnText="Download Full-Text"
            btnStyle="SD"
            leftIcon={icons.lightDownload}
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default FullText;
