
/*!
 * Connect - session - Session
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var utils = require('../../utils');

/**
 * Create a new `Session` with the given request and `data`.
 *
 * @param {IncomingRequest} req
 * @param {Object} data
 * @api private
 */

var Session = module.exports = function Session(req, data) {
  Object.defineProperty(this, 'req', { value: req });
  Object.defineProperty(this, 'id', { value: req.sessionID });
  if ('object' == typeof data) {
    utils.merge(this, data);
  } else {
    this.lastAccess = Date.now();
  }
};

/**
 * Update `.lastAccess` timestamp,
 * and reset `.cookie.maxAge` to prevent
 * the cookie from expiring when the
 * session is still active.
 *
 * @return {Session} for chaining
 * @api public
 */

Session.prototype.touch = function(){
  return this
    .resetLastAccess()
    .resetMaxAge();
};

/**
 * Update `.lastAccess` timestamp.
 *
 * @return {Session} for chaining
 * @api public
 */

Session.prototype.resetLastAccess = function(){
  this.lastAccess = Date.now();
  return this;
};

/**
 * Reset `.maxAge` to `.originalMaxAge`.
 *
 * @return {Session} for chaining
 * @api public
 */

Session.prototype.resetMaxAge = function(){
  this.cookie.maxAge = this.cookie.originalMaxAge;
  return this;
};

/**
 * Save the session data with optional callback `fn(err)`.
 *
 * @param {Function} fn
 * @return {Session} for chaining
 * @api public
 */

Session.prototype.save = function(fn){
  this.req.sessionStore.set(this.id, this, fn || function(){});
  return this;
};

/**
 * Destroy `this` session.
 *
 * @param {Function} fn
 * @return {Session} for chaining
 * @api public
 */

Session.prototype.destroy = function(fn){
  delete this.req.session;
  this.req.sessionStore.destroy(this.id, fn);
  return this;
};

/**
 * Regenerate this request's session.
 *
 * @param {Function} fn
 * @return {Session} for chaining
 * @api public
 */

Session.prototype.regenerate = function(fn){
  this.req.sessionStore.regenerate(this.req, fn);
  return this;
};