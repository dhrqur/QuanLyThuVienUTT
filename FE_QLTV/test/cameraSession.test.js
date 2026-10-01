import assert from "node:assert/strict";
import test from "node:test";
import { createCameraSession } from "../src/components/common/QrScanner/cameraSession.js";

function fakeStream() {
  const track = { readyState: "live", stop() { this.readyState = "ended"; } };
  return { track, getTracks: () => [track] };
}

test("closing releases tracks and detaches the preview", async () => {
  const stream = fakeStream();
  const video = { srcObject: stream };
  const session = createCameraSession();
  await session.start(video, async () => stream, async () => ({ stop() {} }));
  session.stop();
  session.stop();
  assert.equal(stream.track.readyState, "ended");
  assert.equal(video.srcObject, null);
});

test("permission granted after close releases the late stream without decoding", async () => {
  const stream = fakeStream();
  let grantPermission;
  const permission = new Promise((resolve) => { grantPermission = resolve; });
  const session = createCameraSession();
  const started = session.start({}, () => permission, () => { throw new Error("must not decode"); });
  session.stop();
  grantPermission(stream);
  assert.equal(await started, false);
  assert.equal(stream.track.readyState, "ended");
});

test("closing while the decoder starts stops late decoding controls", async () => {
  const stream = fakeStream();
  let finishDecoder;
  let decoderStarted;
  const entered = new Promise((resolve) => { decoderStarted = resolve; });
  const decoder = new Promise((resolve) => { finishDecoder = resolve; });
  let stopped = false;
  const session = createCameraSession();
  const started = session.start({}, async () => stream, () => { decoderStarted(); return decoder; });
  await entered;
  session.stop();
  finishDecoder({ stop() { stopped = true; } });
  assert.equal(await started, false);
  assert.equal(stopped, true);
  assert.equal(stream.track.readyState, "ended");
});

test("decoder failure releases an acquired camera", async () => {
  const stream = fakeStream();
  const video = { srcObject: stream };
  const session = createCameraSession();
  await assert.rejects(session.start(video, async () => stream, async () => { throw new Error("decode failed"); }), /decode failed/);
  assert.equal(stream.track.readyState, "ended");
  assert.equal(video.srcObject, null);
});
