export default AnimatedPath

import React, { PureComponent } from 'react'
import Animated, { Easing } from 'react-native-reanimated'
const { Value, Clock, set } = Animated
import { Path } from 'react-native-svg'
import { bInterpolatePath, runTiming } from 'react-native-redash'

class AnimatedPath extends PureComponent {
    constructor(props) {
        super(props)
        this.currentD = props.d.replace(/,/g, ' ')
        this.clock = new Clock()
    }

    render() {
        const { d: newD, ...other } = this.props
        this.previousD = this.currentD
        this.currentD = newD.replace(/,/g, ' ')

        const AnimatedPath = Animated.createAnimatedComponent(Path)
        const progress = new Value(1)

        return (
            <>
                <Animated.Code>
                    {() =>
                        set(
                            progress,
                            runTiming(this.clock, progress, {
                                toValue: 1,
                                duration: this.props.animationDuration,
                                easing: Easing.linear,
                            })
                        )
                    }
                </Animated.Code>
                <AnimatedPath {...other} d={bInterpolatePath(progress, this.previousD, this.currentD)} />
            </>
        )
    }
}

AnimatedPath.propTypes = {
    animationDuration: PropTypes.number,
    ...Path.propTypes,
}

AnimatedPath.defaultProps = {
    animationDuration: 300,
}

export default AnimatedPath
