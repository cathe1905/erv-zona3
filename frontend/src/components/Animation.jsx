import {useSpring, animated} from "react-spring"

function Number({n}){
    const {number} = useSpring({
        from: {number: 0},
        number: n,
        delay: 200,
        config: {mass:1, tension:20, friction:10},
    });
    return <animated.div className="col-12 m-1 fs-3">{number.to((n) => n.toFixed(0))}</animated.div>
}

export default Number