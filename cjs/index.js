"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.makeUseAxios = makeUseAxios;
exports.serializeCache = exports.loadCache = exports.configure = exports.resetConfigure = exports.__ssrPromises = exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _extends3 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _react = _interopRequireDefault(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _lruCache = _interopRequireDefault(require("lru-cache"));

var actions = {
  REQUEST_START: 'REQUEST_START',
  REQUEST_END: 'REQUEST_END'
};
var defaultUseAxios = makeUseAxios();
var __ssrPromises = defaultUseAxios.__ssrPromises,
    resetConfigure = defaultUseAxios.resetConfigure,
    configure = defaultUseAxios.configure,
    loadCache = defaultUseAxios.loadCache,
    serializeCache = defaultUseAxios.serializeCache;
exports.serializeCache = serializeCache;
exports.loadCache = loadCache;
exports.configure = configure;
exports.resetConfigure = resetConfigure;
exports.__ssrPromises = __ssrPromises;
var _default = defaultUseAxios;
exports["default"] = _default;

function makeUseAxios(configurationOptions) {
  var cache;
  var axiosInstance;
  var __ssrPromises = [];

  function resetConfigure() {
    cache = new _lruCache["default"]();
    axiosInstance = _axios["default"];
  }

  function configure(options) {
    if (options === void 0) {
      options = {};
    }

    if (options.axios !== undefined) {
      axiosInstance = options.axios;
    }

    if (options.cache !== undefined) {
      cache = options.cache;
    }
  }

  resetConfigure();
  configure(configurationOptions);

  function loadCache(data) {
    cache.load(data);
  }

  function serializeCache() {
    return _serializeCache.apply(this, arguments);
  }

  function _serializeCache() {
    _serializeCache = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var ssrPromisesCopy;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              ssrPromisesCopy = [].concat(__ssrPromises);
              __ssrPromises.length = 0;
              _context.next = 4;
              return Promise.all(ssrPromisesCopy);

            case 4:
              return _context.abrupt("return", cache.dump());

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _serializeCache.apply(this, arguments);
  }

  return Object.assign(useAxios, {
    __ssrPromises: __ssrPromises,
    resetConfigure: resetConfigure,
    configure: configure,
    loadCache: loadCache,
    serializeCache: serializeCache
  });

  function cacheAdapter(_x) {
    return _cacheAdapter.apply(this, arguments);
  }

  function _cacheAdapter() {
    _cacheAdapter = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(config) {
      var cacheKey, hit, response, responseForCache;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              cacheKey = JSON.stringify(config);
              hit = cache.get(cacheKey);

              if (!hit) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt("return", hit);

            case 4:
              delete config.adapter;
              _context2.next = 7;
              return axiosInstance(config);

            case 7:
              response = _context2.sent;
              responseForCache = (0, _extends3["default"])({}, response);
              delete responseForCache.config;
              delete responseForCache.request;
              cache.set(cacheKey, responseForCache);
              return _context2.abrupt("return", response);

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _cacheAdapter.apply(this, arguments);
  }

  function createInitialState(options) {
    return {
      loading: !options.manual
    };
  }

  function reducer(state, action) {
    var _extends2;

    switch (action.type) {
      case actions.REQUEST_START:
        return (0, _extends3["default"])({}, state, {
          loading: true,
          error: null
        });

      case actions.REQUEST_END:
        return (0, _extends3["default"])({}, state, {
          loading: false
        }, action.error ? {} : {
          data: action.payload.data
        }, (_extends2 = {}, _extends2[action.error ? 'error' : 'response'] = action.payload, _extends2));

      default:
        return state;
    }
  }

  function request(_x2, _x3) {
    return _request.apply(this, arguments);
  }

  function _request() {
    _request = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(config, dispatch) {
      var response;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              dispatch({
                type: actions.REQUEST_START
              });
              _context3.next = 4;
              return axiosInstance(config);

            case 4:
              response = _context3.sent;
              dispatch({
                type: actions.REQUEST_END,
                payload: response
              });
              return _context3.abrupt("return", response);

            case 9:
              _context3.prev = 9;
              _context3.t0 = _context3["catch"](0);

              if (!_axios["default"].isCancel(_context3.t0)) {
                _context3.next = 13;
                break;
              }

              return _context3.abrupt("return");

            case 13:
              dispatch({
                type: actions.REQUEST_END,
                payload: _context3.t0,
                error: true
              });
              throw _context3.t0;

            case 15:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 9]]);
    }));
    return _request.apply(this, arguments);
  }

  function executeRequestWithCache(config, dispatch) {
    return request((0, _extends3["default"])({}, config, {
      adapter: cacheAdapter
    }), dispatch);
  }

  function executeRequestWithoutCache(config, dispatch) {
    return request(config, dispatch);
  }

  function executeRequest(config, options, dispatch) {
    if (cache && options.useCache) {
      return executeRequestWithCache(config, dispatch);
    }

    return executeRequestWithoutCache(config, dispatch);
  }

  function useAxios(config, options) {
    if (typeof config === 'string') {
      config = {
        url: config
      };
    }

    var stringifiedConfig = JSON.stringify(config);
    options = (0, _extends3["default"])({
      manual: false,
      useCache: true
    }, options);

    var cancelSourceRef = _react["default"].useRef();

    var _React$useReducer = _react["default"].useReducer(reducer, createInitialState(options)),
        state = _React$useReducer[0],
        dispatch = _React$useReducer[1];

    if (typeof window === 'undefined' && !options.manual) {
      useAxios.__ssrPromises.push(axiosInstance((0, _extends3["default"])({}, config, {
        adapter: cacheAdapter
      })));
    }

    _react["default"].useEffect(function () {
      cancelSourceRef.current = _axios["default"].CancelToken.source();

      if (!options.manual) {
        executeRequest((0, _extends3["default"])({
          cancelToken: cancelSourceRef.current.token
        }, config), options, dispatch)["catch"](function () {});
      }

      return function () {
        return cancelSourceRef.current.cancel();
      }; // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stringifiedConfig]);

    var refetch = _react["default"].useCallback(function (configOverride, options) {
      return executeRequest((0, _extends3["default"])({
        cancelToken: cancelSourceRef.current ? cancelSourceRef.current.token : undefined
      }, config, configOverride), (0, _extends3["default"])({
        useCache: false
      }, options), dispatch);
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [stringifiedConfig]);

    return [state, refetch];
  }
}