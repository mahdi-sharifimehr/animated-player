import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions, TouchableOpacity, Text } from 'react-native';
import colors from '../constants/Colors';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowAltCircleLeft, faArrowAltCircleRight, faPauseCircle, faPlayCircle } from '@fortawesome/free-regular-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { TimeAction } from '../redux/slices/user';
import { track_name } from '../constants/Configs';

const { width, height } = Dimensions.get('window');

function Player() {

  const playerRef = useRef(null);
  const dispatch = useDispatch();

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [paused, setPaused] = useState(false);

  const smoothAnim = useRef(new Animated.Value(0)).current;
  const image = require('../assets/images/space.jpg');
  const sound = require('../assets/sounds/relax.mp3');

  const saveTime = (progress) => dispatch(TimeAction(progress));
  const savedTime = useSelector(state => state.user.time);

  const backgroundStyle = {
    transform: [
      {
        translateX: smoothAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -1500],
        })
      },
    ],
  };

  const animatationPromise = () => {
    return new Promise((resolve, reject) => {
      Animated.timing(smoothAnim, {
        toValue: 1,
        duration: 100000,
        useNativeDriver: true
      }).start(async () => {
        resolve()
      })
    })
  }

  useEffect(() => {
    animatationPromise();
  }, []);

  function secondsToTime(time) {
    return ~~(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + time % 60;
  }

  const handleMainButtonTouch = () => {
    setPaused(!paused);
  };

  const handleLoad = data => {
    setDuration(data.duration);
    if (savedTime > 0) SetPlayBack(data.duration);
  };

  function SetPlayBack(duration) {
    setProgress(savedTime);
    playerRef.current.seek(savedTime * duration);
  }

  const handleProgress = progress => {
    if (!seeking) {
      const progres_percentage = progress.currentTime / duration;
      setProgress(progres_percentage);
      saveTime(progres_percentage);
    }
  };

  const handleEnd = () => {
    setPaused(true);
  };

  const handleError = error => {
    setPaused(true);
    console.log(error);
  };

  const slideTo = (number) => {
    const progress = (number * duration);
    setSeeking(false);
    setProgress(progress / duration);
    playerRef.current.seek(progress);
  }

  const backwardTo = () => {
    var current_time = Math.floor(progress * duration);
    if (current_time > 15) {
      current_time = current_time - 15;
      setProgress(current_time / duration);
      playerRef.current.seek(current_time);
    }
  }

  const forwardTo = () => {
    var current_time = Math.floor(progress * duration);
    if (current_time + 15 < duration) {
      current_time = current_time + 15;
      setProgress(current_time / duration);
      playerRef.current.seek(current_time);
    }
  }

  return (
    <View style={styles.body}>
      {/* Animated image for the background */}
      <Animated.View style={[styles.background_container, backgroundStyle]} >
        <Image
          source={image}
          resizeMode='cover'
          style={styles.image}
        />
      </Animated.View>
      {/* Controler buttons for the player */}
      <View style={styles.control_container} >
        {/* Seek bar and counters for the player */}
        <View style={styles.seek_row} >
          <Text style={styles.left_timer} >
            {secondsToTime(Math.floor(progress * duration))}
          </Text>
          <View>
            <Slider
              style={styles.slider}
              value={progress || 0}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor='white'
              maximumTrackTintColor={colors.LIGHT_TRANSPARENT}
              thumbTintColor='white'
              onSlidingStart={(number) => setSeeking(true)}
              onSlidingComplete={(number) => { slideTo(number) }}
            />
          </View>
          <Text style={styles.right_timer} >
            {secondsToTime(Math.floor(duration))}
          </Text>
        </View>
        {/* Backward/Forward and Play/Pause buttons for the player */}
        <View style={styles.buttons_container} >
          <View style={styles.backward_container} >
            <TouchableOpacity onPress={() => { backwardTo() }} >
              <View style={styles.backward_button} >
                <FontAwesomeIcon
                  icon={faArrowAltCircleLeft}
                  size={50}
                  color='white'
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.play_container} >
            <TouchableOpacity onPress={() => handleMainButtonTouch()} >
              <View style={styles.play_button} >
                <FontAwesomeIcon
                  icon={!paused ? faPauseCircle : faPlayCircle}
                  size={50}
                  color='white'
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.forward_container} >
            <TouchableOpacity onPress={() => { forwardTo() }} >
              <View style={styles.forward_button} >
                <FontAwesomeIcon
                  icon={faArrowAltCircleRight}
                  size={50}
                  color='white'
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* The player */}
      <Video
        ref={playerRef}
        source={sound}
        paused={paused}
        onLoad={handleLoad}
        onProgress={handleProgress}
        onEnd={handleEnd}
        onError={handleError}
      />
    </View>
  )
};

export default Player;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  background_container: {
    width: 2000,
    height: height,
  },
  image: {
    width: 2000,
    height: height,
  },
  control_container: {
    backgroundColor: colors.DARK_TRANSPARENT,
    bottom: 250,
    position: "absolute",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  seek_row: {
    flexDirection: "row",
    marginTop: 3,
    alignItems: "center",
    justifyContent: "space-around",
  },
  left_timer: {
    width: 40,
    color: 'white',
    marginRight: 5,
    textAlign: 'right',
    fontSize: 16
  },
  slider: {
    width: width - 90,
  },
  right_timer: {
    width: 40,
    color: 'white',
    marginLeft: 5,
    textAlign: 'left',
    fontSize: 16
  },
  buttons_container: {
    flex: 1,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backward_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  backward_button: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 5,
  },
  play_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  play_button: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  forward_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  forward_button: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  }
})