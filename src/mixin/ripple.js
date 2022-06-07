const ANIMATION_DURATION = 250

function setStyles(element) {
    const { zIndex, position } = window.getComputedStyle(element)

    element.style.overflow = 'hidden'
    element.style.overflowX = 'hidden'
    element.style.overflowY = 'hidden'
    position === 'static' && (element.style.position = 'relative')
    zIndex === 'auto' && (element.style.zIndex = '1')
}

function computeRippleStyles(element, event) {
    const { top, left } = element.getBoundingClientRect()
    const { clientWidth, clientHeight } = element

    const radius = Math.sqrt(clientWidth ** 2 + clientHeight ** 2) / 2
    const size = radius * 2

    const localX = event.touches[0].clientX - left
    const localY = event.touches[0].clientY - top

    const centerX = (clientWidth - radius * 2) / 2
    const centerY = (clientHeight - radius * 2) / 2

    const x = localX - radius
    const y = localY - radius

    return { x, y, centerX, centerY, size }
}

function createRipple(_this, event) {
    const _ripple = _this._ripple
    _ripple.removeRipple()

    if (_ripple.disabled || _ripple.tasker) {
        return
    }

    const task = () => {
        _ripple.tasker = null

        const { x, y, centerX, centerY, size } = computeRippleStyles(_this, event)
        const ripple = document.createElement('div')
        ripple.classList.add('var-ripple')
        ripple.style.opacity = `0`
        ripple.style.transform = `translate(${x}px, ${y}px) scale3d(.3, .3, .3)`
        ripple.style.width = `${size}px`
        ripple.style.height = `${size}px`
        ripple.style.backgroundColor = _ripple.color ?? 'currentColor'
        ripple.dataset.createdAt = String(performance.now())

        setStyles(_this)

        _this.appendChild(ripple)

        window.setTimeout(() => {
            ripple.style.transform = `translate(${centerX}px, ${centerY}px) scale3d(1, 1, 1)`
            ripple.style.opacity = `.25`
        }, 20)
    }

    _ripple.tasker = window.setTimeout(task, 60)
}

function removeRipple(_this) {
    const _ripple = _this._ripple
  
    const task = () => {
      const ripples = _this.querySelectorAll('.var-ripple')
      if (!ripples.length) {
        return
      }
  
      const lastRipple = ripples[ripples.length - 1]
      const delay = ANIMATION_DURATION - performance.now() + Number(lastRipple.dataset.createdAt)
  
      setTimeout(() => {
        lastRipple.style.opacity = `0`
  
        setTimeout(() => lastRipple.parentNode?.removeChild(lastRipple), ANIMATION_DURATION)
      }, delay)
    }
  
    _ripple.tasker ? setTimeout(task, 60) : task()
  }

function forbidRippleTask(_this) {
    const _ripple = _this._ripple
    if (!_ripple.touchmoveForbid) {
        return
    }

    _ripple.tasker && window.clearTimeout(_ripple.tasker)
    _ripple.tasker = null
}

function mounted(el, binding) {
    el._ripple = {
        tasker: null,
        ...(binding.value ?? {}),
        touchmoveForbid: binding.value?.touchmoveForbid ?? context.touchmoveForbid,
        removeRipple: removeRipple.bind(el),
    }

    el.addEventListener('touchstart', createRipple, { passive: true })
    el.addEventListener('touchmove', forbidRippleTask, { passive: true })
    el.addEventListener('dragstart', removeRipple, { passive: true })
    document.addEventListener('touchend', el._ripple.removeRipple, { passive: true })
    document.addEventListener('touchcancel', el._ripple.removeRipple, { passive: true })
}

function unmounted(el) {
    el.removeEventListener('touchstart', createRipple)
    el.removeEventListener('touchmove', forbidRippleTask)
    el.removeEventListener('dragstart', removeRipple)
    document.removeEventListener('touchend', el._ripple.removeRipple)
    document.removeEventListener('touchcancel', el._ripple.removeRipple)
}

function updated(el, binding) {
    el._ripple = {
        ...el._ripple,
        ...(binding.value ?? {}),
        touchmoveForbid: binding.value?.touchmoveForbid ?? context.touchmoveForbid,
        tasker: null,
    }
}

const Ripple = {
    mounted,
    unmounted,
    updated,
    install(app) {
        app.directive('ripple', this)
    },
}

export const _RippleComponent = Ripple

export default Ripple