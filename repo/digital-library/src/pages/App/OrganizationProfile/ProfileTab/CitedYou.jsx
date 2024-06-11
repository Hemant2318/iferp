import { Button, Profile } from "components";

const CitedYou = () => {
  const list = [
    {
      name: "Hayley M Reynolds",
      bio: "Chennai, Tamil Nadu",
      isFollow: true,
    },
    {
      name: "Matthew Lee",
      bio: "Mumbai, Maharastra",
      isFollow: false,
    },
    {
      name: "Yani L",
      bio: "Chennai, Tamil Nadu",
      isFollow: false,
    },
    {
      name: "Pooja S",
      bio: "Chennai, Tamil Nadu",
      isFollow: true,
    },
  ];
  return (
    <div className="shadow">
      <div className="text-17-400 lh-24 color-3d3d cps-22 cpt-16 cpb-10">
        Cited You
      </div>
      <div className="bt-e3e3" />
      <div className="cps-20 cpt-20 cpe-20 cpb-20 d-flex flex-column gap-3">
        {list?.map((elm, index) => {
          const { name, bio, isFollow } = elm;
          return (
            <div className="fa-center gap-2" key={index}>
              <Profile text={name} size="s-66" isRounded />
              <div className="fb-center flex-grow-1">
                <div>
                  <div className="text-15-500 lh-21 color-4d4d hover-effect pointer">
                    {name}
                  </div>
                  <div className="text-13-400 lh-21 color-5555">{bio}</div>
                </div>
                <div>
                  <Button
                    btnText={isFollow ? "Unfollow" : "Follow"}
                    btnStyle={isFollow ? "GO" : "SO"}
                    className={`h-38 ${isFollow ? "" : "ps-4 pe-4"}`}
                    onClick={() => {}}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-center bg-f0f0 pt-2 pb-2">
        <span className="pointer text-14-400 lh-21 color-5555">View all</span>
      </div>
    </div>
  );
};

export default CitedYou;
